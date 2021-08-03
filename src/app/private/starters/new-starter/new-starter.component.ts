import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@supabase/supabase-js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-new-starter',
  templateUrl: './new-starter.component.html',
  styleUrls: ['./new-starter.component.scss']
})
export class NewStarterComponent implements OnInit, OnDestroy {
  user: User | null = null;
  GITHUB_PREFIX: string = 'https://github.com/';
  newStarterForm: FormGroup;
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService
  ) {
    this.newStarterForm = this.formBuilder.group({
      starter_name: ['', Validators.required],
      github_url: ['', Validators.required],
      package_json_url: ['', Validators.required],
      demo_url: [''],
      description: ['', Validators.required],
      cover_photo: ['', Validators.required],
      categories: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.supabaseService.$user.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((user: User | null) => this.user = user);
    this.newStarterForm.get('github_url')?.valueChanges.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((githubUrl: string) => {
    });
  }

  /**
   * Try to help the user fill in their package.json location.
   * @param {FocusEvent} event
   */
  githubUrlBlurred(event: FocusEvent): void {
    const github_url: string = this.newStarterForm.get('github_url')?.value;
    if (!!github_url) {
      this.newStarterForm.get('package_json_url')?.setValue(`${github_url}/package.json`);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
