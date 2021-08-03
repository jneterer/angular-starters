import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupabaseImgComponent } from './supabase-img.component';

describe('SupabaseImgComponent', () => {
  let component: SupabaseImgComponent;
  let fixture: ComponentFixture<SupabaseImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupabaseImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupabaseImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
