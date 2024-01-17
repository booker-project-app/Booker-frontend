import {Injectable, OnInit} from '@angular/core';
import {environment} from "../../env/env";
import {HttpClient} from "@angular/common/http";
import {CreateNotificationDTO} from "../accommodation/dto/CreateNotificationDTO";
import {map} from "rxjs";
import {FormGroup} from "@angular/forms";
import {NotificationDTO} from "../accommodation/dto/NotificationDTO";
import {SnackBarComponent} from "../shared/snack-bar/snack-bar.component";

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit{
  url: string = environment.apiHost + "api/socket";
  restUrl:string = environment.apiHost + "/sendMessageRest";

  private serverUrl = environment.apiHost + 'socket'
  private stompClient: any;
  form!: FormGroup;
  userForm!: FormGroup;

  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  messages: CreateNotificationDTO[] = [];
  constructor(private http: HttpClient,
              private snackBar: SnackBarComponent) { }

  ngOnInit(): void {
    this.initializeWebSocketConnection();
  }

  post(data: CreateNotificationDTO) {
    return this.http.post<CreateNotificationDTO>(this.url, data)
      .pipe(map((data: CreateNotificationDTO) => { return data; }));
  }

  postRest(data: CreateNotificationDTO) {
    return this.http.post<CreateNotificationDTO>(this.restUrl, data)
      .pipe(map((data: CreateNotificationDTO) => { return data; }));
  }

  initializeWebSocketConnection() {
    // serverUrl je vrednost koju smo definisali u registerStompEndpoints() metodi na serveru
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    this.stompClient.connect({}, function () {
      that.isLoaded = true;
      that.openGlobalSocket()
    });

  }

  // Funkcija salje poruku na WebSockets endpoint na serveru
  sendMessageUsingSocket() {
    if (this.form.valid) {
      let message: CreateNotificationDTO = {
        userId: this.form.value.userId,
        content: this.userForm.value.content,
        title: this.form.value.title
      };

      // Primer slanja poruke preko web socketa sa klijenta. URL je
      //  - ApplicationDestinationPrefix definisan u config klasi na serveru (configureMessageBroker() metoda) : /socket-subscriber
      //  - vrednost @MessageMapping anotacije iz kontrolera na serveru : /send/message
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
    }
  }

  // Funckija salje poruku na REST endpoint na serveru
  sendMessageUsingRest() {
    if (this.form.valid) {
      let message: CreateNotificationDTO = {
        userId: this.form.value.userId,
        content: this.userForm.value.content,
        title: this.form.value.title
      };

      this.postRest(message).subscribe(res => {
        console.log(res);
      })
    }
  }

  // Funckija za pretplatu na topic /socket-publisher (definise se u configureMessageBroker() metodi)
  // Globalni socket se otvara prilikom inicijalizacije klijentske aplikacije
  openGlobalSocket() {
    if (this.isLoaded) {
      this.stompClient.subscribe("/socket-publisher", (message: { body: string; }) => {
        this.handleResult(message);
      });
    }
  }

  // Funkcija za pretplatu na topic /socket-publisher/user-id
  // CustomSocket se otvara kada korisnik unese svoj ID u polje 'fromId' u submit callback-u forme 'userForm'
  openSocket(id: string) {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe(`/socket-publisher/${id}`, (message: { body: string; }) => {
        this.handleResult(message);
      });
    }
  }

  // Funkcija koja se poziva kada server posalje poruku na topic na koji se klijent pretplatio
  handleResult(message: { body: string; }) {
    console.log("HANDLE RESULT", message.body);
    if (message.body) {
      let messageResult: NotificationDTO = JSON.parse(message.body);
      console.log("MESSAGE: ", messageResult);
      this.messages.push(messageResult);
      this.snackBar.openSnackBar("Message received: " + messageResult.content, "OK");
    }
  }

}
