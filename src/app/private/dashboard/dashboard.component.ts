import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
