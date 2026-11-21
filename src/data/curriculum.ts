import { day1 } from '@/data/day1';
import { day2 } from '@/data/day2';
import { day3 } from '@/data/day3';
import { day4 } from '@/data/day4';
import { day5 } from '@/data/day5';
import { day6 } from '@/data/day6';
import { day7 } from '@/data/day7';
import type { DayCurriculum, Lesson } from '@/types/curriculum';

export const CURRICULUM: DayCurriculum[] = [day1, day2, day3, day4, day5, day6, day7];

export function getDayByNumber(dayNumber: number): DayCurriculum | undefined {
  return CURRICULUM.find((d) => d.dayNumber === dayNumber);
}

export function getLessonsForDay(day: DayCurriculum): Lesson[] {
  const lessons: Lesson[] = [...day.dsaLessons];
  if (day.lldLesson) lessons.push(day.lldLesson);
  if (day.hldLesson) lessons.push(day.hldLesson);
  return lessons;
}

export function getLessonPath(lesson: Lesson): string {
  return `/day/${lesson.dayNumber}/${lesson.kind}/${lesson.id}`;
}

export function getAllAvailableLessons(): Lesson[] {
  return CURRICULUM.flatMap((day) => (day.status === 'complete' ? getLessonsForDay(day) : []));
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return getAllAvailableLessons().find((l) => l.id === lessonId);
}

export function getAdjacentLessons(lessonId: string): { prev: Lesson | null; next: Lesson | null } {
  const all = getAllAvailableLessons();
  const idx = all.findIndex((l) => l.id === lessonId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
