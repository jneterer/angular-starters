import { Component } from '@angular/core';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  session: Session | null = null;

  constructor(private supabase: SupabaseService) {
    this.supabase.$session.subscribe((session: Session | null) => {
      this.session = session;
    });
  }

}
