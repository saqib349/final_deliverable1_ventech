import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTodo } from './api-todo';

describe('ApiTodo', () => {
  let component: ApiTodo;
  let fixture: ComponentFixture<ApiTodo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiTodo],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiTodo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
