import { Component, ElementRef, Host, HostListener, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface WorkflowStep {
  id: number;
  type: 'main' | 'with-side';
  mainText: string;
  sideRects?: string[];
}

@Component({
  selector: 'app-work-flow',
  standalone: true,
  imports: [CommonModule],
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
  
  
  
  

  
  
  //Umożliwienie przewijania poziomego za pomocą kółka myszy wygenerowanego diagramu
  // @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  // @HostListener('wheel', ['$event'])
  // onWheel(event: WheelEvent) {
  //   if (this.scrollContainer) {
  //     event.preventDefault();
  //     this.scrollContainer.nativeElement.scrollLeft += event.deltaY;
  //   }
  // }

}

