import { Component, OnInit } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'environment';
import { from } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supbaseKey);
  }

  ngOnInit(): void {
  }

  handleLogin(event: MouseEvent): void {
    from(this.supabase.auth.signIn({
      provider: 'github',
    })).subscribe(({ user, session, error }) => {
      console.log('session: ', session);
      console.log('user: ', user);
      console.log('error signing in: ', error);
    });
  }

}
