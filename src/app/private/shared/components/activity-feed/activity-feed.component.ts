import { Component, Input, OnInit } from '@angular/core';
import { StarterActivity } from 'contracts/starters/activity';

@Component({
  selector: 'app-activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss']
})
export class ActivityFeedComponent implements OnInit {
  @Input() activity: StarterActivity[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
