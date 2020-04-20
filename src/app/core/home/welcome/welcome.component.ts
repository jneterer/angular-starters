import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITheme } from 'src/app/contracts/shared/theme';
import { ClientService } from 'src/app/services/client.service';
import { ContentService } from 'src/app/shared/content/content.service';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();
  subscribeForm: FormGroup;
  currentTheme: ITheme;
  statusCode: number = null;

  constructor(private formBuilder: FormBuilder,
              private contentService: ContentService,
              private clientService: ClientService,
              private gaService: GoogleAnalyticsService) { }

  ngOnInit(): void {
    // Subscribe to any theme changes.
    this.contentService.currentThemeConfig$.pipe(takeUntil(this.unsubscribe)).subscribe((theme: ITheme) => this.currentTheme = theme);
    this.subscribeForm = this.formBuilder.group({
      name: '',
      email: ['', [Validators.email, Validators.required]]
    });
  }

  /**
   * Smooth scroll to the heroes container
   */
  scrollToHeroes(): void {
    document.querySelector('.heroes-container')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  /**
   * Subscribes the user to our email.
   */
  subscribe(): void {
    if (this.subscribeForm.valid) {
      const email: string = this.subscribeForm.get('email').value;
      const name: string = this.subscribeForm.get('name').value;
      this.clientService.subscribe(email, name)
      .subscribe((response: { statusCode: number}) => {
        this.statusCode = response.statusCode;
        if (response.statusCode === 202) {
          this.gaService.sendEvent('Form Submit', 'Home - Email Subscribe', 'Success')
        } else {
          this.gaService.sendEvent('Form Submit', 'Home - Email Subscribe', 'Failure')
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
