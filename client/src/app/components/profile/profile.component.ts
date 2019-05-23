import { Component, OnInit, Input } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() user: any = null;
  profile: any;

  constructor(private sharedServiceService: SharedServiceService) { }
  
  ngOnInit() {
    this.sharedServiceService.getProfile(this.user.id)
    .subscribe(
      (data: any) => {this.profile = data;},
      (error) => { console.log(error); }
    )
  }

}
