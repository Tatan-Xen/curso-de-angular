import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  friendID: any;
  friends: User[];
  friend: User;
  price: number = 78;
  today: any = Date.now();
  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService) {
      // this.friends = this.userService.getFriends();
      this.friendID = this.activatedRoute.snapshot.params['uid'];
      //El objeto del amigo seleccionado
      this.friend = this.friends.find((record) => {
        return record.uid == this.friendID
      })

      console.log(this.friend);
  }

  ngOnInit() {
  }

}
