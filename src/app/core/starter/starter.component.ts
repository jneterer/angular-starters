import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { GITHUB_PREFIX } from 'constants/prefixes';
import { Starter } from 'contracts/starters/starter';
import { environment } from 'environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent implements OnInit {
  starterCoverBucket: string = `public/${environment.starterCoverBucket}`;
  githubPrefix: string = GITHUB_PREFIX;
  starter: Starter | undefined;
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(({ starter }: Data) => {
      if (!starter) {
        this.router.navigate(['/']);
      } else {
        this.starter = starter;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
