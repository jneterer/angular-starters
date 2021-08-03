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

}
