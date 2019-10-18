import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { MainComponent } from "./main/main.component";

import { IMqttMessage, MqttModule, IMqttServiceOptions } from "ngx-mqtt";

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: "test.mosquitto.org",
  port: 8081,
  path: "/jdsr",
  protocol: "wss"
};

@NgModule({
  declarations: [AppComponent, MainComponent],
  imports: [BrowserModule, MqttModule.forRoot(MQTT_SERVICE_OPTIONS)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
