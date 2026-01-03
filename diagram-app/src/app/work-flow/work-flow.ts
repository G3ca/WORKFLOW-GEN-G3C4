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


  
  
  
  
  
  
  
  
  
  
  
  
  //Umożliwienie przewijania poziomego za pomocą kółka myszy wygenerowanego diagramu
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.scrollContainer) {
      event.preventDefault();
      this.scrollContainer.nativeElement.scrollLeft += event.deltaY;
    }
  }

}

