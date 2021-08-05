import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { STARTER_STATUSES } from 'constants/starters';
import { StarterStatus, StarterStatuses } from 'contracts/starters/starter';
import { UserProfile } from 'contracts/user/profile';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SupabaseService } from 'shared/services/supabase/supabase.service';

@Component({
  selector: 'app-status-dropdown',
  templateUrl: './status-dropdown.component.html',
  styleUrls: ['./status-dropdown.component.scss']
})
export class StatusDropdownComponent implements OnInit, OnDestroy {
  @Input() selected: StarterStatus = 'REVIEW';
  @Output() onSelect: EventEmitter<StarterStatus> = new EventEmitter<StarterStatus>();
  user: UserProfile | null = null;
  statusOptions: StarterStatuses[] = STARTER_STATUSES;
  open: boolean = false;
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(private supabaseService: SupabaseService) { }

  ngOnInit(): void {
    this.supabaseService.$userProfile.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((user: UserProfile | null) => {
      this.user = user;
      if (user) {
        this.filterStatusOptions(user, this.selected);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && changes.selected.currentValue && this.user) {
      this.filterStatusOptions(this.user, changes.selected.currentValue);
    }
  }

  /**
   * Filters the available status options based on the user's role
   * and current status.
   * @param {UserProfile} user
   * @param {StarterStatus} selectedStatus
   */
  filterStatusOptions(user: UserProfile, selectedStatus: StarterStatus): void {
    if (user.role === 'admin') {
      if (selectedStatus === 'REVIEW') {
        this.statusOptions = this.statusOptions.filter((status: StarterStatuses) => status.value !== 'REVIEW');
      } else {
        this.statusOptions = this.statusOptions.filter((status: StarterStatuses) => status.value !== selectedStatus && status.value !== 'REVIEW');
      }
    } else if (user.role === 'user') {
      if (selectedStatus === 'REVIEW') {
        this.statusOptions = this.statusOptions.filter((status: StarterStatuses) => status.value === 'REVIEW');
      } else if (selectedStatus === 'ACTIVE') {
        this.statusOptions = this.statusOptions.filter((status: StarterStatuses) => status.value === 'REVIEW');
      } else if (selectedStatus === 'REJECTED') {
        this.statusOptions = this.statusOptions.filter((status: StarterStatuses) => status.value === 'REJECTED');
      } else if (selectedStatus === 'REVISE') {
        this.statusOptions = this.statusOptions.filter((status: StarterStatuses) => status.value === 'REVIEW');
      }
    }
  }

  /**
   * Selects a new status option.
   * @param {StarterStatus} newStatus
   */
  onSelected(newStatus: StarterStatus): void {
    this.open = false;
    this.onSelect.emit(newStatus);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
