import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { GITHUB_PREFIX } from 'constants/prefixes';
import { Starter } from 'contracts/starters/starter';
import { StartersService } from 'private/shared/services/starters/starters.service';
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
  GITHUB_PREFIX: string = GITHUB_PREFIX;
  newStarterForm: FormGroup;
  submitted: boolean = false;
  saveStarterError: string | null = null;
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private startersService: StartersService,
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

  /**
   * When the user selects a file, convert it to a base64 string,
   * set the file name, and allow the user to upload it.
   * @param {Event} event 
   */
  selectFile(event: Event): void {
    const files: FileList | null = (<HTMLInputElement>event.target)?.files;
    if (files?.length) {
      const reader = new FileReader();
      const selectedFile: File = files[0];
      if (selectedFile.size > 1e6) {
        this.newStarterForm.get('cover_photo')?.errors
        this.newStarterForm.get('cover_photo')?.setErrors({
          tooLarge: true,
        });
        return;
      }
      reader.readAsDataURL(selectedFile);
      var that = this;
      reader.onload = () => {
        that.newStarterForm.get('cover_photo')?.setValue(reader.result);
        if (that.newStarterForm.get('cover_photo')?.errors) {
          that.newStarterForm.get('cover_photo')?.setErrors(null);
        }
      };
      reader.onerror = (error) => {
      };
    }
  }

  /**
   * Creates a new starter.
   * @param {Event} event
   */
  submitNewStarter(event: Event): void {
    this.submitted = true;
    if (this.newStarterForm.valid && this.user) {
      const categories: string[] = this.newStarterForm.value.categories.split(',');
      const { cover_photo, demo_url, ...starterFormValues } = this.newStarterForm.value;
      const imgType: string = cover_photo.substring("data:image/".length, cover_photo.indexOf(";base64"))
      this.startersService.createStarter({
        ...starterFormValues,
        demo_url: `https://${demo_url}`,
        categories,
        user_id: this.user.id,
        cover_photo: `${starterFormValues.starter_name}.${imgType}`
      }, cover_photo.split(',')[1])
        .subscribe((result: Starter | null) => {
          this.router.navigate(['/app/starters']);
        }, (error: Error) => {
          this.saveStarterError = error.message;
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
