import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Todoslist } from './todoslist';

describe('Todoslist', () => {
  let component: Todoslist;
  let fixture: ComponentFixture<Todoslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Todoslist],
    }).compileComponents();

    fixture = TestBed.createComponent(Todoslist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
