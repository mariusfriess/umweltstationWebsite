import { Component, OnInit } from "@angular/core";
import { MqttService, IMqttMessage } from "ngx-mqtt";
import { Subscription } from "rxjs";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  private subscription: Subscription;
  public message: string;

  constructor(private _mqttService: MqttService) {
    this.subscription = this._mqttService
      .observe("jdsr/#")
      .subscribe((message: IMqttMessage) => {
        this.message = message.payload.toString();
        console.log(message.topic);
        console.log(this.message);
      });
  }

  ngOnInit() {}
}
