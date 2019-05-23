import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  posts: any = []
  constructor(private sharedServiceService: SharedServiceService) { }

  ngOnInit() {
     this.sharedServiceService.getPosts()
     .subscribe(
       (posts) => { this.posts = posts},
       (err) => { console.log(err); }
     )
  }

}
