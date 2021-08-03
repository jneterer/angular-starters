import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStarterComponent } from './new-starter.component';

describe('NewStarterComponent', () => {
  let component: NewStarterComponent;
  let fixture: ComponentFixture<NewStarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStarterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
