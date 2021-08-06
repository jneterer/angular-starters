import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaginateStartersResponse } from 'contracts/starters/public';
import { Starter } from 'contracts/starters/starter';
import { environment } from 'environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StartersService } from 'shared/services/starters/starters.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  starterCoverBucket: string = `public/${environment.starterCoverBucket}`;
  starters: Starter[] = []
  getStartersError: string = '';
  start: number = 0;
  end: number = 11;
  total: number = 11;
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(private startersService: StartersService) { }

  ngOnInit(): void {
    this.paginateStarters();
  }

  /**
   * Paginate for starters.
   */
  paginateStarters(): void {
    this.startersService.getStarters(this.start, this.end)
      .pipe(
        takeUntil(this.unsubscribe)
      ).subscribe(({ starters, total }: PaginateStartersResponse) => {
        this.starters = this.starters.concat(starters);
        this.total = total;
        this.start += 12;
        this.end += 12;
        this.getStartersError = '';
      }, (error: Error) => {
        this.getStartersError = error.message;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
