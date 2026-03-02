import { createHighlighter } from 'shiki';
import type { Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['typescript', 'javascript', 'tsx', 'jsx', 'bash', 'python', 'json', 'css', 'sql'],
    });
  }
  return highlighterPromise;
}
