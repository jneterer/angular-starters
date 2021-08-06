import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { encode } from 'base64-arraybuffer';
import { GITHUB_PREFIX } from 'constants/prefixes';
import { Starter, StarterRevision } from 'contracts/starters/starter';
import { environment } from 'environment';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ImagesService } from 'shared/services/images/images.service';

export interface StarterForm {
  starter_name: string;
  github_url: string;
  package_json_url: string;
  demo_url: string;
  description: string;
  cover_photo: string;
  categories: string;
}

@Component({
  selector: 'app-starter-form',
  templateUrl: './starter-form.component.html',
  styleUrls: ['./starter-form.component.scss']
})
export class StarterFormComponent implements OnInit, OnChanges {
  @Input() starter?: Starter;
  @Input() starterRevision?: StarterRevision;
  @Input() saveStarterError: string = '';
  @Input() deleteStarterError: string = '';
  @Output() saveStarter: EventEmitter<[StarterForm, boolean]> = new EventEmitter<[StarterForm, boolean]>();
  @Output() deleteStarter: EventEmitter<any> = new EventEmitter<any>();
  wantsToDelete: boolean = false;
  GITHUB_PREFIX: string = GITHUB_PREFIX;
  newStarterForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private supabaseImageService: ImagesService,
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    let currentStarter: Starter | StarterRevision | undefined;
    if (changes.starterRevision && changes.starterRevision.currentValue) {
      currentStarter = changes.starterRevision.currentValue;
    } else if (changes.starter && changes.starter.currentValue) {
      currentStarter = changes.starter.currentValue;
    }
    if (currentStarter) {
      const { cover_photo, categories, ...rest }: Starter | StarterRevision = currentStarter;
      this.newStarterForm.patchValue({
        ...rest,
        categories: currentStarter.categories.join(', '),
      });
      this.supabaseImageService.downLoadImage(`public/${environment.starterCoverBucket}`, `${rest.user_id}/${rest.id}/${cover_photo}`)
        .pipe(mergeMap((img: Blob) => {
          return from(img.arrayBuffer());
        })).subscribe((img: ArrayBuffer) => {
          const imgAsBase64: string = encode(img);
          this.newStarterForm.get('cover_photo')?.setValue(`data:image/${cover_photo.split('.')[1]};base64,${imgAsBase64}`);
        }, (error: Error) => {

        }, () => this.newStarterForm.get('cover_photo')?.markAsPristine());
    }
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
        that.newStarterForm.get('cover_photo')?.markAsTouched();
        if (that.newStarterForm.get('cover_photo')?.errors) {
          that.newStarterForm.get('cover_photo')?.setErrors(null);
        }
      };
      reader.onerror = (error) => {
      };
    }
  }

  /**
   * When the user submits the form, pass the data up to the parent.
   * @param {Event} event
   */
  onSubmit(event: Event): void {
    this.submitted = true;
    if (this.newStarterForm.valid) {
      this.saveStarter.emit([this.newStarterForm.value, !!this.newStarterForm.get('cover_photo')?.touched]);
    }
  }

  /**
   * When the clicks the delete starter button, pass the data up to the parent.
   * @param {Event} event
   */
  onDeleteStarter(event: Event): void {
    this.deleteStarter.emit();
  }

}
