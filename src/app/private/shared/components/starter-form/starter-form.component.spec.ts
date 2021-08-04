import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterFormComponent } from './starter-form.component';

describe('StarterFormComponent', () => {
  let component: StarterFormComponent;
  let fixture: ComponentFixture<StarterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
