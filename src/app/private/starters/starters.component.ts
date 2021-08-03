import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-starters',
  templateUrl: './starters.component.html',
  styleUrls: ['./starters.component.scss']
})
export class StartersComponent implements OnInit {
  starters: {}[] = [];

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Signs the user out.
   * @param {MouseEvent} event
   */
  signOut(event: MouseEvent): void {
    this.supabaseService.signOut().subscribe(() => { }, () => { }, () => {
      this.router.navigate(['/sign-in']);
    });
  }

}
