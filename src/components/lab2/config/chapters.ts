import * as THREE from 'three';

export interface Chapter {
  id: string;
  label: string;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  /** Maps to /public/projects/{projectId}/ folder. Undefined for intro. */
  projectId?: string;
  /** Maps to Projects.{translationKey} in messages JSON. Undefined for intro. */
  translationKey?: string;
}

/**
 * CHAPTERS — 6 camera waypoints defining the scroll-driven path through /lab2.
 * All downstream math derives from CHAPTERS.length — no magic numbers.
 *
 * Camera waypoints are designed to frame the scene content placed in Plan 02.
 * Each chapter's group focal center (SceneManager group position) is the lookAt target.
 * Chapters are spaced ~6 units apart on the Z axis so scenes don't overlap.
 */
export const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    label: 'Intro',
    position: new THREE.Vector3(0, 2, 5),
    lookAt: new THREE.Vector3(0, 0.5, 0),
  },
  {
    id: 'project-1',
    label: 'Project 1',
    position: new THREE.Vector3(4, 1.5, -2),
    lookAt: new THREE.Vector3(1, 0.5, -5),
    projectId: '6',
    translationKey: 'artWar',
  },
  {
    id: 'project-2',
    label: 'Project 2',
    position: new THREE.Vector3(-4, 2, -8),
    lookAt: new THREE.Vector3(-1, 0.5, -11),
    projectId: '2',
    translationKey: 'dyCms',
  },
  {
    id: 'project-3',
    label: 'Project 3',
    position: new THREE.Vector3(3, 2.5, -14),
    lookAt: new THREE.Vector3(0, 0.5, -17),
    projectId: '1',
    translationKey: 'joshua',
  },
  {
    id: 'project-4',
    label: 'Project 4',
    position: new THREE.Vector3(-3, 1.5, -20),
    lookAt: new THREE.Vector3(0, 0.5, -23),
    projectId: '3',
    translationKey: 'retailAnalysis',
  },
  {
    id: 'project-5',
    label: 'Project 5',
    position: new THREE.Vector3(0, 2, -26),
    lookAt: new THREE.Vector3(0, 0.5, -29),
    projectId: '5',
    translationKey: 'dinoGo',
  },
];

/** Total number of chapters — always derived from array length, never hardcoded. */
export const CHAPTER_COUNT = CHAPTERS.length;

/** Normalized scroll distance per chapter (0-1). */
export const CHAPTER_STEP = 1 / CHAPTER_COUNT;

/**
 * Returns the chapter index (0-based) for a given scroll progress (0-1).
 * Clamps to the last chapter at progress === 1.
 */
export function getChapterIndex(progress: number): number {
  return Math.min(Math.floor(progress * CHAPTER_COUNT), CHAPTER_COUNT - 1);
}

/**
 * Returns the local progress (0-1) within the current chapter for a given
 * overall scroll progress (0-1).
 *
 * Example: progress 0.25 with 6 chapters → chapter index 1, local progress 0.5
 */
export function getChapterProgress(progress: number): number {
  const index = getChapterIndex(progress);
  const chapterStart = index * CHAPTER_STEP;
  return (progress - chapterStart) / CHAPTER_STEP;
}
