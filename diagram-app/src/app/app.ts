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
}