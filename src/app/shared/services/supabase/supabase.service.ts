import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private session: BehaviorSubject<Session | null> = new BehaviorSubject<Session | null>(null);
  public $session: Observable<Session | null> = this.session.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supbaseKey);
    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => this.session.next(session));
  }

}
