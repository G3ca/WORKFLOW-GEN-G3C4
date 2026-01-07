import { Component, ElementRef, Host, HostListener, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface WorkflowStep {
  id: number;
  type: 'main' | 'with-side';
  mainText: string;
  sideRects?: string[];
}

@Component({
  selector: 'app-work-flow',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-flow.html',
  styleUrls: ['./work-flow.css']
})


export class WorkFlowComponent {

  @Input() steps: WorkflowStep[] = [];

  //Stan Widoku
  scale = 1;
  pan = { x: 0, y: 0 };

  //Stan przeciągania
  isDragging = false;
  private lastMousePosition = { x: 0, y: 0 };

  OnWheel(event: WheelEvent) {
    event.preventDefault();
    const zoomIntensity = 0.1;
    this.scale += zoomIntensity * (event.deltaY > 0 ? -1 : 1);
    this.scale = Math.min(Math.max(this.scale, 0.1), 5); // Ograniczenie skali między 0.1 a 5
  }

  StartPan(event: MouseEvent) {
    event.preventDefault();
    this.isDragging = true;
    this.lastMousePosition = { x: event.clientX, y: event.clientY };
  }

  @HostListener('document:mousemove', ['$event'])
  OnMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const deltaY = event.clientY - this.lastMousePosition.y;
      const deltaX = event.clientX - this.lastMousePosition.x;

      this.pan.x += deltaX;
      this.pan.y += deltaY;

      this.lastMousePosition = { x: event.clientX, y: event.clientY };
    }

  }

  @HostListener('document:mouseup', ['$event'])
  OnMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }


  addStepAtIndex(index: number, event: MouseEvent) {
    event.stopPropagation();
    const newStep: WorkflowStep = {
      id: Date.now(),
      type: 'main',
      mainText: 'Nowy krok'
    };
    this.steps.splice(index, 0, newStep);
  }

  deleteStep(index: number) {
    this.steps.splice(index, 1);
  }

  toggleType(step: WorkflowStep) {
    if (step.type === 'main') {
      step.type = 'with-side';
      step.sideRects = ['Krok 1'];
    } else {
      step.type = 'main';
      delete step.sideRects;
    }
  }

  addRect(step: WorkflowStep) {
    if (!step.sideRects) step.sideRects = [];
    if (step.sideRects.length < 5) {
      step.sideRects.push(`Krok ${step.sideRects.length + 1}`);
    }
  }

  removeRect(step: WorkflowStep, index: number) {
    if (step.sideRects) {
      step.sideRects.splice(index, 1);
      if (step.sideRects.length === 0) {
        step.type = 'main';
      }
    }

  }



  isEditMode: boolean = true;

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  isVertical: boolean = false;
  toggleOrientation() {
    this.isVertical = !this.isVertical;
  }
}

