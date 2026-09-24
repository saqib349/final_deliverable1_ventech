import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTodoAssistant } from './ai-todo-assistant';

describe('AiTodoAssistant', () => {
  let component: AiTodoAssistant;
  let fixture: ComponentFixture<AiTodoAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiTodoAssistant],
    }).compileComponents();

    fixture = TestBed.createComponent(AiTodoAssistant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
