import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-site',
  templateUrl: './new-site.component.html',
  styleUrls: ['./new-site.component.scss']
})
export class NewSiteComponent implements OnInit {
  GITHUB_PREFIX: string = 'https://github.com/';
  newSiteForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.newSiteForm = this.formBuilder.group({
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

  /**
   * Try to help the user fill in their package.json location.
   * @param {FocusEvent} event
   */
  githubUrlBlurred(event: FocusEvent): void {
    const github_url: string = this.newSiteForm.get('github_url')?.value;
    if (!!github_url) {
      this.newSiteForm.get('package_json_url')?.setValue(`${github_url}/package.json`);
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
      reader.readAsDataURL(selectedFile);
      let fileName: string = '';
      let file: string | ArrayBuffer | null = '';
      let fileType: string = '';
      reader.onload = () => {
        fileName = selectedFile.name;
        file = reader.result;
        fileType = selectedFile.type.split('/')[1];
        return;
      };
      reader.onerror = (error) => {
      };
    }
  }

}
