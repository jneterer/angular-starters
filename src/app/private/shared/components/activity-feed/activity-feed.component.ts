import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StarterActivity } from 'contracts/starters/activity';

@Component({
  selector: 'app-activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss']
})
export class ActivityFeedComponent implements OnInit {
  @Input() activity: StarterActivity[] = [];
  comment: FormControl = new FormControl('');

  constructor() { }

  ngOnInit(): void {
  }

}
