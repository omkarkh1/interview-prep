export type LessonKind = 'dsa' | 'lld' | 'hld';

export type DayStatus = 'complete' | 'coming-soon';

export type AccentTone = 'default' | 'primary' | 'emerald' | 'amber' | 'rose';

export interface CodeCallout {
  id: string;
  startLine: number;
  endLine: number;
  title: string;
  explanation: string;
  accent?: 'primary' | 'emerald' | 'amber' | 'rose';
}

export interface ComplexityBreakdown {
  time: string;
  space: string;
  timeExplanation: string;
  spaceExplanation: string;
}

export interface InterviewEdgeCase {
  title: string;
  scenario: string;
  handling: string;
}

/* ===========================
 * DSA VISUAL STEPPER SCHEMAS
 * =========================== */

export interface VariablePill {
  name: string;
  value: string;
  highlight?: boolean;
  tone?: AccentTone;
}

export interface ArrayPointerTag {
  label: string;
  index: number;
  tone?: 'primary' | 'emerald' | 'amber' | 'rose';
}

export interface ArrayPointersStep {
  caption: string;
  formula?: string;
  values: (string | number)[];
  barMode?: {
    maxHeight: number;
    waterLevels?: number[];
    shadedSpan?: { start: number; end: number; height: number };
  };
  windowRange?: {
    start: number;
    end: number;
    tone?: 'primary' | 'emerald' | 'amber' | 'rose';
    label?: string;
  };
  cellStates?: Record<number, 'active' | 'match' | 'excluded' | 'dependency' | 'best'>;
  pointers: ArrayPointerTag[];
  auxStructure?: {
    title: string;
    entries: {
      key: string;
      value: string;
      highlight?: boolean;
      tone?: 'primary' | 'emerald' | 'amber' | 'rose';
    }[];
  };
  variables: VariablePill[];
}

export interface ArrayPointersVisualizer {
  kind: 'array-pointers';
  title: string;
  inputSummary: string;
  steps: ArrayPointersStep[];
}

export interface DpCellCoord {
  row: number;
  col: number;
  label?: string;
  tone?: 'amber' | 'emerald' | 'rose' | 'primary';
}

export interface DpTable2DStep {
  caption: string;
  recurrence: string;
  concreteFormula: string;
  grid: (string | number | null)[][];
  activeCell?: { row: number; col: number };
  dependencyCells?: DpCellCoord[];
  pathCells?: { row: number; col: number }[];
  variables: VariablePill[];
}

export interface DpTable2DVisualizer {
  kind: 'dp-table-2d';
  title: string;
  inputSummary: string;
  rowAxisLabel: string;
  colAxisLabel: string;
  rowHeaders: string[];
  colHeaders: string[];
  steps: DpTable2DStep[];
}

export interface Dp1DStackHeapStep {
  caption: string;
  recurrence?: string;
  concreteFormula?: string;
  inputItems?: {
    label: string;
    values: (string | number)[];
    activeIndex?: number;
    processedUntil?: number;
  };
  primaryArray: {
    label: string;
    indices?: (string | number)[];
    values: (string | number)[];
    activeIndex?: number;
    dependencyIndices?: { index: number; label?: string }[];
    pointers?: ArrayPointerTag[];
  };
  secondaryContainer?: {
    kind: 'stack' | 'heap' | 'list';
    title: string;
    items: { value: string | number; meta?: string; highlight?: boolean }[];
  };
  variables: VariablePill[];
}

export interface Dp1DStackHeapVisualizer {
  kind: 'dp-1d-stack-heap';
  title: string;
  inputSummary: string;
  steps: Dp1DStackHeapStep[];
}

export interface GraphNodeSpec {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdgeSpec {
  from: string;
  to: string;
  weight?: string;
}

export interface TreeGraphStep {
  caption: string;
  formula?: string;
  activeNodeId?: string;
  dependencyNodeIds?: string[];
  visitedNodeIds?: string[];
  highlightedNodeIds?: string[];
  activeEdges?: { from: string; to: string }[];
  nodeStates: Record<string, string>;
  variables: VariablePill[];
}

export interface TreeGraphVisualizer {
  kind: 'tree-graph';
  title: string;
  inputSummary: string;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  directed?: boolean;
  nodes: GraphNodeSpec[];
  edges: GraphEdgeSpec[];
  steps: TreeGraphStep[];
}

export type DsaVisualizerSpec =
  | ArrayPointersVisualizer
  | DpTable2DVisualizer
  | Dp1DStackHeapVisualizer
  | TreeGraphVisualizer;

/* ===========================
 * DSA LESSON
 * =========================== */

export interface DsaLesson {
  id: string;
  dayNumber: number;
  kind: 'dsa';
  title: string;
  subtitle: string;
  difficulty: 'Medium' | 'Hard';
  patterns: string[];
  estimatedMinutes: number;
  leetcodeRef?: string;
  problemStatement: string;
  exampleSummary: {
    input: string;
    output: string;
    explanation: string;
  };
  patternRecognition: {
    interviewCue: string;
    signals: string[];
    mentalModel: string;
  };
  intuitionComparison: {
    bruteForce: {
      approach: string;
      timeComplexity: string;
      spaceComplexity: string;
      bottleneck: string;
    };
    optimal: {
      approach: string;
      timeComplexity: string;
      spaceComplexity: string;
      keyInvariant: string;
    };
  };
  visualizer: DsaVisualizerSpec;
  javaSolution: {
    filename: string;
    code: string;
    callouts: CodeCallout[];
  };
  complexity: ComplexityBreakdown;
  edgeCases: InterviewEdgeCase[];
}

/* ===========================
 * LLD LESSON
 * =========================== */

export interface LldEntity {
  name: string;
  role: string;
  keyFields: string[];
  invariants: string;
}

export interface DesignPatternRationale {
  pattern: string;
  whereUsed: string;
  whatBreaksWithoutIt: string;
  howItSolvesIt: string;
}

export interface LldCodeFile {
  filename: string;
  label: string;
  summary: string;
  code: string;
  callouts: CodeCallout[];
}

export interface LldLesson {
  id: string;
  dayNumber: number;
  kind: 'lld';
  title: string;
  subtitle: string;
  patterns: string[];
  estimatedMinutes: number;
  problemScope: {
    summary: string;
    functionalRequirements: string[];
    concurrencyAndScaleAssumptions: string[];
    explicitNonGoals: string[];
  };
  coreEntities: LldEntity[];
  designPatterns: DesignPatternRationale[];
  diagrams: {
    classDiagram: {
      title: string;
      caption: string;
      mermaid: string;
    };
    sequenceDiagram: {
      title: string;
      caption: string;
      mermaid: string;
    };
  };
  codeFiles: LldCodeFile[];
  solidHighlights: {
    principle:
      | 'Single Responsibility'
      | 'Open/Closed'
      | 'Liskov Substitution'
      | 'Interface Segregation'
      | 'Dependency Inversion';
    application: string;
  }[];
  extensibilityScenarios: {
    scenario: string;
    changesRequired: string;
  }[];
  concurrencyChoices: {
    topic: string;
    mechanism: string;
    rationale: string;
  }[];
}

/* ===========================
 * HLD LESSON
 * =========================== */

export interface CapacityMathRow {
  metric: string;
  formula: string;
  result: string;
  notes: string;
}

export type HldNodeCategory =
  | 'client'
  | 'edge'
  | 'service'
  | 'cache'
  | 'queue'
  | 'database'
  | 'storage';

export interface HldNode {
  id: string;
  label: string;
  sublabel?: string;
  category: HldNodeCategory;
  x: number;
  y: number;
  width?: number;
  height?: number;
  flows: ('write' | 'read')[];
  details: {
    role: string;
    dataFlow: string;
    scalingStrategy: string;
    failureHandling: string;
    techChoices: string[];
  };
}

export interface HldEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  flow: 'write' | 'read' | 'both';
  async?: boolean;
  fromSide?: 'right' | 'bottom' | 'left' | 'top';
  toSide?: 'left' | 'top' | 'right' | 'bottom';
  labelT?: number;
}

export interface HldTradeOff {
  topic: string;
  context: string;
  options: {
    name: string;
    recommended?: boolean;
    pros: string[];
    cons: string[];
    whenToChoose: string;
  }[];
  seniorVerdict: string;
}

export interface HldLesson {
  id: string;
  dayNumber: number;
  kind: 'hld';
  title: string;
  subtitle: string;
  tags: string[];
  estimatedMinutes: number;
  overview: string;
  requirements: {
    functional: string[];
    nonFunctional: {
      metric: string;
      target: string;
      rationale: string;
    }[];
  };
  capacityMath: {
    assumptions: string[];
    calculations: CapacityMathRow[];
  };
  apiAndDataModel: {
    endpoints: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      path: string;
      summary: string;
      payload?: string;
    }[];
    storageSchema: {
      store: string;
      schema: string;
      shardingAndIndexing: string;
    }[];
  };
  architecture: {
    title: string;
    summary: string;
    defaultSelectedNodeId: string;
    nodes: HldNode[];
    edges: HldEdge[];
  };
  tradeOffs: HldTradeOff[];
}

/* ===========================
 * CURRICULUM DAY
 * =========================== */

export type Lesson = DsaLesson | LldLesson | HldLesson;

export interface PlannedTopicPreview {
  kind: LessonKind;
  title: string;
  focus: string;
}

export interface DayCurriculum {
  dayNumber: number;
  title: string;
  theme: string;
  status: DayStatus;
  estimatedMinutes: number;
  summary: string;
  dsaLessons: DsaLesson[];
  lldLesson?: LldLesson;
  hldLesson?: HldLesson;
  plannedPreview?: PlannedTopicPreview[];
}
