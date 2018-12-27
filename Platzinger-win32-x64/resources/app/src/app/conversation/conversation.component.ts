import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  friendId: any;
  friend: User;
  user: User;
  conversation_id: string;
  textMessage: string;
  conversation: any[];
  shake: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;
  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService, private conversationService: ConversationService, private authenticationService: AuthenticationService, private firebaseStorage: AngularFireStorage) {
      this.friendId = this.activatedRoute.snapshot.params['uid'];
      console.log(this.friendId);
      //El objeto del amigo seleccionado
      this.authenticationService.getStatus().subscribe((session)=>{
        this.userService.getUserById(session.uid).valueChanges().subscribe((user: User) =>{
          this.user = user;
          this.userService.getUserById(this.friendId).valueChanges().subscribe(
            (data: User)=>{
              this.friend = data;
              const ids = [this.user.uid, this.friend.uid].sort();
              this.conversation_id = ids.join('|');
              this.getConversation();
          },(error) =>{
            console.error(error);
          });
        });
      });
  }

  ngOnInit() {
  }
  sendMessage(){
    const message ={
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'text'
    };
    this.conversationService.createConversation(message).then(()=>{
      this.textMessage = '';
    });
  }
  sendZumbido(){
    const message ={
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: null,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'zumbido'
    };
    this.conversationService.createConversation(message).then(()=>{});
    this.doZumbido();
  }

  sendImage() {
    if(this.croppedImage){
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage.ref('pictures/'+ currentPictureId +'.jpg').putString(this.croppedImage, 'data_url');      
      pictures.then((result)=>{
        this.picture = this.firebaseStorage.ref('pictures/'+ currentPictureId +'.jpg').getDownloadURL();
        this.picture.subscribe((p)=>{
          //Imagen
          const message ={
            uid: this.conversation_id,
            timestamp: Date.now(),
            text:  p,
            sender: this.user.uid,
            receiver: this.friend.uid,
            type: 'picture'
          };
          this.conversationService.createConversation(message).then(()=>{
            this.croppedImage = '';
          });
        })
      }).catch((error)=>{
        console.error(error);
      })
    }else{
      this.userService.editUser(this.user).then(() => {
        alert("Cambios guardados")
      }).catch((error) => {
        alert('Hubo un error');
        console.error(error);
      })
    }
  }

  doZumbido(){
    const audio = new Audio('assets/sound/zumbido.m4a');
    audio.play();
    this.shake = true;
    window.setTimeout(()=>{
      this.shake = false
    }, 1000)
  }



  getConversation(){
    this.conversationService.getConversation(this.conversation_id).valueChanges().subscribe((data)=>{
      this.conversation = data;
      this.conversation.forEach((message)=>{
        if(!message.seen){
          message.seen = true;
          this.conversationService.editConversation(message);
          if(message.type == 'text'){            
            const audio = new Audio('assets/sound/new_message.m4a');
            audio.play();
          }else if(message.type == 'zumbido'){
            this.doZumbido();
          }          
        }
      })
      console.log(data)
    },(error)=>{
      console.error(error)
    });
  }
  getUserNickById(id){
    if(id === this.friend.uid){
      return this.friend.nick;
    }else{
      return this.user.nick
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
}
