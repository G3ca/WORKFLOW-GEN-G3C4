import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  DestroyRef,
  signal,
  computed,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslationService } from '../services/translation.service';
import { WorkflowStep, SideRect, createSideRect } from '../models/workflow.model';
import { CANVAS_CONFIG, WORKFLOW_CONFIG } from '../config/canvas.config';

// Re-export for backwards compatibility
export type { WorkflowStep, SideRect } from '../models/workflow.model';

@Component({
  selector: 'app-work-flow',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-flow.html',
  styleUrls: ['./work-flow.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkFlowComponent implements OnInit {

  /** Injected services */
  public lang = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  /** ViewChild reference to workflow container for export functionality */
  @ViewChild('workflowContainer') workflowContainer!: ElementRef<HTMLElement>;

  /** Signal-based Input/Output (Angular 17+) */
  readonly steps = input<WorkflowStep[]>([]);
  readonly stepsChange = output<WorkflowStep[]>();

  /** View state as Signals */
  scale = signal(1);
  pan = signal({ x: 0, y: 0 });
  isDragging = signal(false);
  isEditMode = signal(true);
  isVertical = signal(false);

  /** Private state for drag tracking */
  private lastMousePosition = { x: 0, y: 0 };

  /** Computed transform for zoom layer */
  transform = computed(() =>
    `translate(${this.pan().x}px, ${this.pan().y}px) scale(${this.scale()})`
  );

  ngOnInit(): void {
    this.setupMouseEventListeners();
  }

  /**
   * Sets up document-level mouse event listeners using RxJS.
   * Automatically cleans up when component is destroyed.
   */
  private setupMouseEventListeners(): void {
    // Handle mouse move for panning
    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        filter(() => this.isDragging()),
        throttleTime(CANVAS_CONFIG.THROTTLE_MS, undefined, { leading: true, trailing: true }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        const deltaX = event.clientX - this.lastMousePosition.x;
        const deltaY = event.clientY - this.lastMousePosition.y;

        this.pan.update((p) => ({ x: p.x + deltaX, y: p.y + deltaY }));
        this.lastMousePosition = { x: event.clientX, y: event.clientY };
        this.cdr.markForCheck();
      });

    // Handle mouse up to stop dragging
    fromEvent<MouseEvent>(document, 'mouseup')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isDragging.set(false);
      });
  }

  /**
   * Handles mouse wheel events for zooming.
   * @param event - The wheel event
   */
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = CANVAS_CONFIG.ZOOM_INTENSITY * (event.deltaY > 0 ? -1 : 1);

    this.scale.update((s) =>
      Math.min(Math.max(s + delta, CANVAS_CONFIG.MIN_ZOOM), CANVAS_CONFIG.MAX_ZOOM)
    );
  }

  /**
   * Initiates panning operation.
   * @param event - The mouse down event
   */
  startPan(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
    this.lastMousePosition = { x: event.clientX, y: event.clientY };
  }

  /**
   * Adds a new step at the specified index.
   * Emits updated steps array to parent component.
   * @param index - The position to insert the new step
   * @param event - The mouse event (used to stop propagation)
   */
  addStepAtIndex(index: number, event: MouseEvent): void {
    event.stopPropagation();
    const newStep: WorkflowStep = {
      id: Date.now(),
      type: 'main',
      mainText: this.lang.t().NEW_STEP_DEFAULT_TEXT
    };
    const updatedSteps = [...this.steps()];
    updatedSteps.splice(index, 0, newStep);
    this.stepsChange.emit(updatedSteps);
  }

  /**
   * Deletes a step at the specified index.
   * @param index - The index of the step to delete
   */
  deleteStep(index: number): void {
    const updatedSteps = this.steps().filter((_, i) => i !== index);
    this.stepsChange.emit(updatedSteps);
  }

  /**
   * Toggles the type of a step between 'main' and 'with-side'.
   * Uses immutable pattern to avoid direct mutation of input objects.
   * @param step - The step to toggle
   */
  toggleType(step: WorkflowStep): void {
    const updatedSteps = this.steps().map(s => {
      if (s.id !== step.id) return s;

      return s.type === 'main'
        ? { ...s, type: 'with-side' as const, sideRects: [createSideRect(`${this.lang.t().NEW_RECT_DEFAULT_TEXT} 1`, 0)] }
        : { ...s, type: 'main' as const, sideRects: undefined };
    });

    this.stepsChange.emit(updatedSteps);
  }

  /**
   * Adds a side rectangle to a step (max 5).
   * Uses immutable pattern to create new array instead of mutating.
   * @param step - The step to add rectangle to
   */
  addRect(step: WorkflowStep): void {
    const currentRects = step.sideRects ?? [];
    if (currentRects.length >= WORKFLOW_CONFIG.MAX_SIDE_RECTS) return;

    const newRect = createSideRect(
      `${this.lang.t().NEW_RECT_DEFAULT_TEXT} ${currentRects.length + 1}`,
      currentRects.length
    );

    const updatedSteps = this.steps().map(s =>
      s.id === step.id
        ? { ...s, sideRects: [...currentRects, newRect] }
        : s
    );

    this.stepsChange.emit(updatedSteps);
  }

  /**
   * Removes a side rectangle from a step.
   * Uses immutable pattern - creates new arrays instead of splice.
   * @param step - The step to remove rectangle from
   * @param rectId - The ID of the rectangle to remove
   */
  removeRect(step: WorkflowStep, rectId: string): void {
    if (!step.sideRects) return;

    const newRects = step.sideRects.filter(r => r.id !== rectId);

    const updatedSteps = this.steps().map(s => {
      if (s.id !== step.id) return s;

      return newRects.length === 0
        ? { ...s, type: 'main' as const, sideRects: undefined }
        : { ...s, sideRects: newRects };
    });

    this.stepsChange.emit(updatedSteps);
  }

  /**
   * Updates the main text of a step.
   * Emits updated steps array to parent component.
   * @param step - The step to update
   * @param newText - The new text content
   */
  onMainTextChange(step: WorkflowStep, newText: string): void {
    const updatedSteps = this.steps().map(s =>
      s.id === step.id ? { ...s, mainText: newText } : s
    );
    this.stepsChange.emit(updatedSteps);
  }

  /**
   * Updates the text of a side rectangle.
   * Emits updated steps array to parent component.
   * @param step - The step containing the rectangle
   * @param rectId - The ID of the rectangle to update
   * @param newText - The new text content
   */
  onRectTextChange(step: WorkflowStep, rectId: string, newText: string): void {
    const updatedSteps = this.steps().map(s => {
      if (s.id !== step.id || !s.sideRects) return s;

      return {
        ...s,
        sideRects: s.sideRects.map(r =>
          r.id === rectId ? { ...r, text: newText } : r
        )
      };
    });
    this.stepsChange.emit(updatedSteps);
  }

  /**
   * Returns the workflow container element for export functionality.
   * Used by parent component to access the DOM element for SVG export.
   * @returns The native HTMLElement of the workflow container
   */
  getContainerElement(): HTMLElement | null {
    return this.workflowContainer?.nativeElement ?? null;
  }

  /**
   * Limits the number of lines in a textarea.
   * Prevents Enter key if max lines reached.
   * @param event - The keyboard event
   * @param maxLines - Maximum number of lines allowed
   */
  limitLines(event: KeyboardEvent, maxLines: number): void {
    const textarea = event.target as HTMLTextAreaElement;
    const lines = textarea.value.split('\n').length;

    if (event.key === 'Enter' && lines >= maxLines) {
      event.preventDefault();
    }
  }

  /**
   * Toggles between edit and view mode.
   */
  toggleEditMode(): void {
    this.isEditMode.update((mode) => !mode);
  }

  /**
   * Toggles between horizontal and vertical layout.
   */
  toggleOrientation(): void {
    this.isVertical.update((v) => !v);
  }
}