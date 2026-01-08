/**
 * Type representing the workflow step variants.
 * - 'main': A standalone main step (circle)
 * - 'with-side': A main step with additional side rectangles
 */
export type WorkflowStepType = 'main' | 'with-side';

/**
 * Represents a side rectangle within a workflow step.
 * Using a dedicated interface enables proper tracking in @for loops
 * and provides better type safety for rectangle operations.
 * 
 * @interface SideRect
 * @property {string} id - Unique identifier for the rectangle
 * @property {string} text - The text content displayed in the rectangle
 * 
 * @example
 * ```typescript
 * const rect: SideRect = {
 *   id: 'rect-1704672000000-0',
 *   text: 'Sub-step description'
 * };
 * ```
 */
export interface SideRect {
  readonly id: string;
  text: string;
}

/**
 * Creates a new SideRect with a unique ID.
 * 
 * @param text - The text content for the rectangle
 * @param index - Optional index for ID generation
 * @returns A new SideRect instance
 */
export function createSideRect(text: string, index?: number): SideRect {
  return {
    id: `rect-${Date.now()}-${index ?? Math.random().toString(36).slice(2, 9)}`,
    text
  };
}

/**
 * Represents a single step in the workflow diagram.
 * 
 * @interface WorkflowStep
 * @property {number} id - Unique identifier for the step (typically timestamp)
 * @property {WorkflowStepType} type - The visual type of the step
 * @property {string} mainText - The text content displayed in the main circle
 * @property {SideRect[]} [sideRects] - Optional array of side rectangles (max 5)
 * 
 * @example
 * ```typescript
 * const step: WorkflowStep = {
 *   id: Date.now(),
 *   type: 'with-side',
 *   mainText: 'Main Step',
 *   sideRects: [
 *     { id: 'rect-1', text: 'Sub-step 1' },
 *     { id: 'rect-2', text: 'Sub-step 2' }
 *   ]
 * };
 * ```
 */
export interface WorkflowStep {
  readonly id: number;
  type: WorkflowStepType;
  mainText: string;
  sideRects?: SideRect[];
}

/**
 * Type guard to validate if an unknown object is a valid SideRect.
 * 
 * @param obj - The object to validate
 * @returns True if the object conforms to SideRect interface
 */
export function isValidSideRect(obj: unknown): obj is SideRect {
  if (typeof obj !== 'object' || obj === null) return false;
  const rect = obj as Record<string, unknown>;
  return typeof rect['id'] === 'string' && typeof rect['text'] === 'string';
}

/**
 * Type guard to validate if an unknown object is a valid WorkflowStep.
 * Supports both legacy format (string[]) and new format (SideRect[]).
 * 
 * @param obj - The object to validate
 * @returns True if the object conforms to WorkflowStep interface
 * 
 * @example
 * ```typescript
 * const data = JSON.parse(jsonString);
 * if (isValidWorkflowStep(data)) {
 *   // data is now typed as WorkflowStep
 * }
 * ```
 */
export function isValidWorkflowStep(obj: unknown): obj is WorkflowStep {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const step = obj as Record<string, unknown>;
  
  if (
    typeof step['id'] !== 'number' ||
    (step['type'] !== 'main' && step['type'] !== 'with-side') ||
    typeof step['mainText'] !== 'string'
  ) {
    return false;
  }

  // sideRects can be undefined, array of strings (legacy), or array of SideRect
  if (step['sideRects'] === undefined) return true;
  
  if (!Array.isArray(step['sideRects'])) return false;
  
  return step['sideRects'].every((r) => 
    typeof r === 'string' || isValidSideRect(r)
  );
}

/**
 * Validates an array of workflow steps.
 * Handles migration from legacy format (string[] sideRects) to new format (SideRect[]).
 * 
 * @param data - Unknown data to validate
 * @returns Validated and migrated array of WorkflowStep objects
 * @throws {Error} If data is not an array or contains invalid steps
 */

export function validateWorkflowSteps(data: unknown): WorkflowStep[] {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array');
  }
  
  if (!data.every(isValidWorkflowStep)) {
    throw new Error('Invalid workflow step structure');
  }
  
  // Migrate legacy format (string[]) to new format (SideRect[])
  return (data as WorkflowStep[]).map(step => ({
    ...step,
    sideRects: step.sideRects?.map((rect, index) => 
      typeof rect === 'string' 
        ? createSideRect(rect, index) 
        : rect
    )
  }));
}
