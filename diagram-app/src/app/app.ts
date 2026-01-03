import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkFlowComponent, WorkflowStep } from './work-flow/work-flow';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkFlowComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  // Lista przechowująca wszystkie kroki diagramu
  workflowSteps: WorkflowStep[] = [];

  // Zmienne powiązane z polami input (ngModel)
  mainInput: string = '';
  rect1: string = '';
  rect2: string = '';
  rect3: string = '';

  // Dodaje zwykłe koło
  addCircle() {
    if (!this.mainInput.trim()) return;

    this.workflowSteps.push({
      id: Date.now(),
      type: 'main',
      mainText: this.mainInput
    });

    this.resetInputs();
  }

  // Dodaje koło z prostokątami
  addComplex() {
    if (!this.mainInput.trim()) return;

    this.workflowSteps.push({
      id: Date.now(),
      type: 'with-side',
      mainText: this.mainInput,
      sideRects: [
        this.rect1 || 'Opcja 1',
        this.rect2 || 'Opcja 2',
        this.rect3 || 'Opcja 3'
      ]
    });

    this.resetInputs();
  }

  // Czyści formularz po dodaniu
  resetInputs() {
    this.mainInput = '';
    this.rect1 = '';
    this.rect2 = '';
    this.rect3 = '';
  }
}