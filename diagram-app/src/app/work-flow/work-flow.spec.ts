import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowComponent } from './work-flow';

describe('WorkFlowComponent', () => {
  let component: WorkFlowComponent;
  let fixture: ComponentFixture<WorkFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
