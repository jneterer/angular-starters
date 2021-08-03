import { Component, OnDestroy, OnInit } from '@angular/core';
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
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(private supabaseService: SupabaseService) { }

  ngOnInit(): void {
    this.supabaseService.$user.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((user: User | null) => this.user = user);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
