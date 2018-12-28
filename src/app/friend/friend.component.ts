import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from 'firebase';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {
  @Input() uid: string;
  friend: User;

  constructor(private userService: UserService) { }
  ngOnInit() {
    this.userService.getUserById(this.uid).valueChanges().subscribe((data: User)=>{
      this.friend = data;
    },(error)=>{
      console.error(error);
    })
  }

}
