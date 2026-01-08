/**
 * Canvas zoom and interaction configuration constants.
 * Centralizes magic numbers for better maintainability.
 */
export const CANVAS_CONFIG = {
  /** Throttle interval for mouse move events (~60fps frame rate) */
  THROTTLE_MS: 16,
  /** Minimum zoom level */
  MIN_ZOOM: 0.1,
  /** Maximum zoom level */
  MAX_ZOOM: 5,
  /** Zoom intensity per scroll wheel tick */
  ZOOM_INTENSITY: 0.1
} as const;

/**
 * Workflow diagram configuration constants.
 */
export const WORKFLOW_CONFIG = {
  /** Maximum characters allowed in main circle text */
  MAX_MAIN_TEXT_LENGTH: 60,
  /** Maximum characters allowed in side rectangle text */
  MAX_RECT_TEXT_LENGTH: 100,
  /** Maximum number of side rectangles per step */
  MAX_SIDE_RECTS: 5
} as const;
