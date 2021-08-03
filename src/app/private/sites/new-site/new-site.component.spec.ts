import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSiteComponent } from './new-site.component';

describe('NewSiteComponent', () => {
  let component: NewSiteComponent;
  let fixture: ComponentFixture<NewSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
