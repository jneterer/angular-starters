import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitStarterComponent } from './submit-starter.component';

describe('SubmitStarterComponent', () => {
  let component: SubmitStarterComponent;
  let fixture: ComponentFixture<SubmitStarterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitStarterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
