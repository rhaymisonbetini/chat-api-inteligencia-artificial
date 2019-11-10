import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';
import { BehaviorSubject } from 'rxjs';

export class Message {
  constructor(public content: string, public sentBy: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly token = environment.dialogFlow.angularBoot;
  readonly client = new ApiAiClient({ accessToken: this.token });
  conversation = new BehaviorSubject<Message[]>([]);

  constructor() {
  }

  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);
    console.log(userMessage);

    return this.client.textRequest(msg)
      .then(res => {
        const speech = res.result.fulfillment.speech;
        console.log(speech);
        const botMessage = new Message(speech, 'bot');
        this.update(botMessage);
      });
  }

  update(msg: Message) {
    this.conversation.next([msg]);
  }
}
