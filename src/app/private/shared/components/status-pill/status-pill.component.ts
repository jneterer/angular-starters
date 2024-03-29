import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StarterStatus } from 'contracts/starters/starter';

@Component({
  selector: 'app-status-pill',
  templateUrl: './status-pill.component.html',
  styleUrls: ['./status-pill.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StatusPillComponent implements OnInit {
  @Input() status?: StarterStatus | 'loading' = 'loading';

  constructor() { }

  ngOnInit(): void {
  }

}
