import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkFlowComponent, WorkflowStep } from './work-flow/work-flow';
import * as htmlToImage from 'html-to-image';
import { TranslationService } from './translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkFlowComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

  constructor(public lang: TranslationService) {}

  // Lista przechowująca kroki diagramu
  workflowSteps: WorkflowStep[] = [];

  // Zmienne powiązane z polami input (ngModel)
  mainInput: string = '';
  rect1: string = '';
  rect2: string = '';
  rect3: string = '';

  // Dodanie kroku głównego
  addCircle() {
    if (!this.mainInput.trim()) return;

    this.workflowSteps.push({
      id: Date.now(),
      type: 'main',
      mainText: this.mainInput
    });

    this.resetInputs();
  }

  // Dodanie opcji bocznych do kroku
  addComplex() {
    if (!this.rect1.trim() && !this.rect2.trim() && !this.rect3.trim()) return;
    if (!this.mainInput.trim()) return;

    this.workflowSteps.push({
      id: Date.now(),
      type: 'with-side',
      mainText: this.mainInput,
      sideRects: [this.rect1, this.rect2, this.rect3].filter(rect => rect.trim() !== '')
    });

    this.resetInputs();
  }

  // Czyszczenie pól input

  resetInputs() {
    this.mainInput = '';
    this.rect1 = '';
    this.rect2 = '';
    this.rect3 = '';
  }

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  //Zapis diagramu do pliku JSON

  saveWorkflow() {
    const dataStr = JSON.stringify(this.workflowSteps, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-diagram-${Date.now()}.json`;
    a.click();

    window.URL.revokeObjectURL(url);
  }


  loadWorkflow(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const content = e.target?.result;
        const loadedSteps: WorkflowStep[] = JSON.parse(content);
        if (!Array.isArray(loadedSteps)) {
          alert('Błąd: Niepoprawny format pliku!');
          throw new Error('Nieprawidłowy format pliku JSON.');
        }
        this.workflowSteps = loadedSteps;

      } catch (error) {
        console.error('Błąd podczas wczytywania pliku:', error);
        alert('Błąd odczytu pliku JSON.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input file value
  }


  exportToSVG() {
    const node = document.getElementById('workflow-container');
    if (!node) {
      alert('Nie znaleziono kontenera diagramu!');
      return;
    }

    htmlToImage.toSvg(node)
      .then((dataUrl: string) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `workflow-diagram-${Date.now()}.svg`;
        a.click();
      })
      .catch((error: any) => {
        console.error('Błąd podczas eksportu do SVG:', error);
        alert('Wystąpił błąd podczas eksportu do SVG.');
      });
  }

  // Modal state
  isModalOpen = false;
  modalTitle = '';
  modalIcon = '';
  modalContent: string[] = [];
  modalFaqContent: { q: string; a: string }[] = [];
  isFaqModal = false;
  isTextModal = false;

  // Metoda do wyświetlania samouczków
  showTutorial(type: 'basics' | 'workflow' | 'shortcuts' | 'faq') {
    const t = this.lang.t();
    
    this.isFaqModal = type === 'faq';
    this.isTextModal = type === 'basics';
    this.modalFaqContent = [];
    this.modalContent = [];

    switch (type) {
      case 'basics':
        this.modalIcon = '📖';
        this.modalTitle = t.TUTORIAL_BASICS_TITLE;
        this.modalContent = t.TUTORIAL_BASICS_CONTENT as string[];
        break;
      case 'workflow':
        this.modalIcon = '🔄';
        this.modalTitle = t.TUTORIAL_WORKFLOW_TITLE;
        this.modalContent = t.TUTORIAL_WORKFLOW_CONTENT as string[];
        break;
      case 'faq':
        this.modalIcon = '❓';
        this.modalTitle = t.TUTORIAL_FAQ_TITLE;
        this.modalFaqContent = t.TUTORIAL_FAQ_CONTENT as { q: string; a: string }[];
        break;
    }

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }
}