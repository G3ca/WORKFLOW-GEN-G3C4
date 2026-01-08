import { Component, ViewChild, ChangeDetectionStrategy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkFlowComponent } from './work-flow/work-flow';
import { WorkflowStep, validateWorkflowSteps } from './models/workflow.model';
import * as htmlToImage from 'html-to-image';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkFlowComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  /** Injected services */
  public lang = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);

  /** ViewChild reference to the workflow component for SVG export */
  @ViewChild('workflowRef') workflowRef!: WorkFlowComponent;

  /** List of workflow steps */
  workflowSteps = signal<WorkflowStep[]>([]);

  /** Sidebar state */
  isSidebarOpen = signal(false);

  /** Modal state */
  isModalOpen = signal(false);
  modalTitle = signal('');
  modalIcon = signal('');
  modalContent = signal<string[]>([]);
  modalFaqContent = signal<{ q: string; a: string }[]>([]);
  isFaqModal = signal(false);
  isTextModal = signal(false);

  /**
   * Handles step changes from child WorkFlowComponent.
   * @param steps - Updated workflow steps array
   */
  onStepsChange(steps: WorkflowStep[]): void {
    this.workflowSteps.set(steps);
    this.cdr.markForCheck();
  }

  /**
   * Saves the workflow diagram to a JSON file.
   */
  saveWorkflow(): void {
    const dataStr = JSON.stringify(this.workflowSteps(), null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `workflow-diagram-${Date.now()}.json`;
    anchor.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Loads a workflow diagram from a JSON file.
   * Validates the JSON structure before applying.
   * Includes proper error handling for FileReader operations.
   * @param event - The file input change event
   */
  loadWorkflow(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    // Handle FileReader errors
    reader.onerror = (): void => {
      console.error('FileReader error:', reader.error);
      alert(this.lang.t().FILE_READ_ERROR);
      input.value = '';
    };

    reader.onload = (e: ProgressEvent<FileReader>): void => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);

        // Validate and migrate using type guard
        const loadedSteps = validateWorkflowSteps(parsedData);
        this.workflowSteps.set(loadedSteps);
        this.cdr.markForCheck();
      } catch (error) {
        console.error('Error loading workflow file:', error);
        alert(error instanceof Error ? error.message : this.lang.t().FILE_PARSE_ERROR);
      } finally {
        input.value = ''; // Reset to allow reloading same file
      }
    };

    reader.readAsText(file);
  }

  /**
   * Exports the workflow diagram to an SVG file.
   * Uses ViewChild reference to access the workflow container.
   */
  exportToSVG(): void {
    // Access workflow container through ViewChild reference
    const workflowContainer = this.workflowRef?.getContainerElement();
    if (!workflowContainer) {
      alert(this.lang.t().EXPORT_ERROR);
      return;
    }

    htmlToImage
      .toSvg(workflowContainer)
      .then((dataUrl: string) => {
        const anchor = document.createElement('a');
        anchor.href = dataUrl;
        anchor.download = `workflow-diagram-${Date.now()}.svg`;
        anchor.click();
      })
      .catch((error: Error) => {
        console.error('Error exporting to SVG:', error);
        alert(this.lang.t().EXPORT_ERROR);
      });
  }

  /**
   * Toggles the sidebar visibility.
   */
  toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
  }

  /**
   * Shows a tutorial modal based on type.
   * @param type - The type of tutorial to display
   */
  showTutorial(type: 'basics' | 'workflow' | 'shortcuts' | 'faq'): void {
    const t = this.lang.t();

    this.isFaqModal.set(type === 'faq');
    this.isTextModal.set(type === 'basics');
    this.modalFaqContent.set([]);
    this.modalContent.set([]);

    switch (type) {
      case 'basics':
        this.modalIcon.set('📖');
        this.modalTitle.set(t.TUTORIAL_BASICS_TITLE);
        this.modalContent.set(t.TUTORIAL_BASICS_CONTENT as string[]);
        break;
      case 'workflow':
        this.modalIcon.set('🔄');
        this.modalTitle.set(t.TUTORIAL_WORKFLOW_TITLE);
        this.modalContent.set(t.TUTORIAL_WORKFLOW_CONTENT as string[]);
        break;
      case 'faq':
        this.modalIcon.set('❓');
        this.modalTitle.set(t.TUTORIAL_FAQ_TITLE);
        this.modalFaqContent.set(t.TUTORIAL_FAQ_CONTENT as { q: string; a: string }[]);
        break;
    }

    this.isModalOpen.set(true);
  }

  /**
   * Closes the modal dialog.
   */
  closeModal(): void {
    this.isModalOpen.set(false);
  }

  /**
   * Handles clicks on the modal overlay to close modal.
   * @param event - The mouse click event
   */
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }
}