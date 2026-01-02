
export enum LessonStep {
  INTRO = 'INTRO',
  STICK_METHOD = 'STICK_METHOD',
  TREE_DIAGRAM = 'TREE_DIAGRAM',
  CIRCLE_PRACTICE = 'CIRCLE_PRACTICE',
  COMPARISON = 'COMPARISON',
  SUMMARY = 'SUMMARY'
}

export interface Feedback {
  type: 'success' | 'error' | 'info';
  message: string;
}
