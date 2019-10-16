import { Component, OnInit, AfterViewInit } from "@angular/core";
import { MqttService, IMqttMessage } from "ngx-mqtt";
import { Subscription } from "rxjs";
import { Chart } from "chart.js";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements AfterViewInit {
  private subscription: Subscription;
  public message: string;
  tempChart: Chart;
  humChart: Chart;
  co2Chart: Chart;

  tempLow = 100;
  tempHigh = 0;

  constructor(private _mqttService: MqttService) {}

  ngAfterViewInit() {
    const ctx = document.getElementById("tempChart");
    this.tempChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: "",
        datasets: [
          {
            label: "Temperatur",
            data: [],
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243,0.1)"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: false,
                precision: 2,
                maxTicksLimit: 6
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 8
              }
            }
          ]
        },
        layout: {
          padding: {
            top: 20
          }
        }
      }
    });

    const ctx2 = document.getElementById("humChart");
    this.humChart = new Chart(ctx2, {
      type: "line",
      data: {
        labels: "",
        datasets: [
          {
            label: "Temperatur",
            data: [],
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243,0.1)"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: false,
                precision: 2,
                maxTicksLimit: 6
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 8
              }
            }
          ]
        },
        layout: {
          padding: {
            top: 20
          }
        }
      }
    });

    const ctx3 = document.getElementById("co2Chart");
    this.co2Chart = new Chart(ctx3, {
      type: "line",
      data: {
        labels: "",
        datasets: [
          {
            label: "Temperatur",
            data: [],
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243,0.1)"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: false,
                precision: 2,
                maxTicksLimit: 6
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 8
              }
            }
          ]
        },
        layout: {
          padding: {
            top: 20
          }
        }
      }
    });

    this.subscription = this._mqttService
      .observe("umweltstation/#")
      .subscribe((message: IMqttMessage) => {
        this.message = message.payload.toString();
        console.log(message.topic);
        console.log(this.message);
        this.handleMessage(message);
      });
  }

  handleMessage(msg: IMqttMessage) {
    if (msg.topic == "umweltstation/temp") {
      this.handleTemp(msg);
    }
    if (msg.topic == "umweltstation/hum") {
      this.handleHum(msg);
    }
    if (msg.topic == "umweltstation/co2") {
      this.handleCo2(msg);
    }
  }

  handleCo2(msg: IMqttMessage) {
    let d = new Date();
    this.co2Chart.data.labels.push(d.getHours() + ":" + d.getMinutes());
    this.co2Chart.data.datasets[0].data.push(
      parseFloat(msg.payload.toString())
    );
    if (this.co2Chart.data.datasets[0].data.length > 100) {
      this.co2Chart.data.labels.shift();
      this.co2Chart.data.datasets[0].data.shift();
    }
    this.co2Chart.update();
  }

  handleHum(msg: IMqttMessage) {
    let d = new Date();
    this.humChart.data.labels.push(d.getHours() + ":" + d.getMinutes());
    this.humChart.data.datasets[0].data.push(
      parseFloat(msg.payload.toString())
    );
    /*
    if (parseFloat(msg.payload.toString()) < this.tempLow)
      this.tempLow = parseFloat(msg.payload.toString());
    if (parseFloat(msg.payload.toString()) > this.tempHigh)
      this.tempHigh = parseFloat(msg.payload.toString());
    this.tempChart.options.scales.yAxes[0].ticks.min = this.tempLow - 0.2;
    this.tempChart.options.scales.yAxes[0].ticks.max = this.tempHigh + 0.2;*/
    if (this.humChart.data.datasets[0].data.length > 100) {
      this.humChart.data.labels.shift();
      this.humChart.data.datasets[0].data.shift();
    }
    this.humChart.update();
  }

  handleTemp(msg: IMqttMessage) {
    let d = new Date();
    this.tempChart.data.labels.push(d.getHours() + ":" + d.getMinutes());
    this.tempChart.data.datasets[0].data.push(
      parseFloat(msg.payload.toString())
    );
    if (parseFloat(msg.payload.toString()) < this.tempLow)
      this.tempLow = parseFloat(msg.payload.toString());
    if (parseFloat(msg.payload.toString()) > this.tempHigh)
      this.tempHigh = parseFloat(msg.payload.toString());
    this.tempChart.options.scales.yAxes[0].ticks.min = this.tempLow - 0.2;
    this.tempChart.options.scales.yAxes[0].ticks.max = this.tempHigh + 0.2;
    if (this.tempChart.data.datasets[0].data.length > 100) {
      this.tempChart.data.labels.shift();
      this.tempChart.data.datasets[0].data.shift();
    }
    this.tempChart.update();
  }
}
