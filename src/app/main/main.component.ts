import { Component, OnInit, AfterViewInit } from "@angular/core";
import { MqttService, IMqttMessage } from "ngx-mqtt";
import { Subscription } from "rxjs";
import { Chart } from "chart.js";

const chartOptions = {
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
          maxTicksLimit: 4
        }
      }
    ]
  },
  layout: {
    padding: {
      top: 20
    }
  }
};

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements AfterViewInit {
  private subscription: Subscription;
  public message: string;
  tempChartIn: Chart;
  humChartIn: Chart;
  co2ChartIn: Chart;

  tempChartOut: Chart;
  humChartOut: Chart;
  co2ChartOut: Chart;

  tempIndoor = 0;
  tempOutdoor = 0;
  humIndoor = 0;
  humOutdoor = 0;
  co2Indoor = 0;
  co2Outdoor = 0;

  tempLow = 100;
  tempHigh = 0;

  constructor(private _mqttService: MqttService) {}

  ngAfterViewInit() {
    const ctx = document.getElementById("tempChart");
    this.tempChartIn = new Chart(ctx, {
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
      options: chartOptions
    });

    const ctx2 = document.getElementById("humChart");
    this.humChartIn = new Chart(ctx2, {
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
      options: chartOptions
    });

    const ctx3 = document.getElementById("co2Chart");
    this.co2ChartIn = new Chart(ctx3, {
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
      options: chartOptions
    });

    const ctx4 = document.getElementById("tempChartOut");
    this.tempChartOut = new Chart(ctx4, {
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
      options: chartOptions
    });

    const ctx5 = document.getElementById("humChartOut");
    this.humChartOut = new Chart(ctx5, {
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
      options: chartOptions
    });

    const ctx6 = document.getElementById("co2ChartOut");
    this.co2ChartOut = new Chart(ctx6, {
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
      options: chartOptions
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
    if (msg.topic == "umweltstation/indoor/temp") {
      this.handleTemp(msg, "indoor");
    }
    if (msg.topic == "umweltstation/indoor/hum") {
      this.handleHum(msg, "indoor");
    }
    if (msg.topic == "umweltstation/indoor/co2") {
      this.handleCo2(msg, "indoor");
    }
    if (msg.topic == "umweltstation/outdoor/temp") {
      this.handleTemp(msg, "outdoor");
    }
    if (msg.topic == "umweltstation/outdoor/hum") {
      this.handleHum(msg, "outdoor");
    }
    if (msg.topic == "umweltstation/outdoor/co2") {
      this.handleCo2(msg, "outdoor");
    }
  }

  handleTemp(msg: IMqttMessage, s: string) {
    let chart;
    if (s == "indoor") {
      chart = this.tempChartIn;
      this.tempIndoor = parseFloat(msg.payload.toString());
    } else {
      chart = this.tempChartOut;
      this.tempOutdoor = parseFloat(msg.payload.toString());
    }
    let d = new Date();
    chart.data.labels.push(d.getHours() + ":" + d.getMinutes());
    chart.data.datasets[0].data.push(parseFloat(msg.payload.toString()));
    if (chart.data.datasets[0].data.length > 100) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
    chart.update();
  }

  handleHum(msg: IMqttMessage, s: string) {
    let chart;
    if (s == "indoor") {
      chart = this.humChartIn;
      this.humIndoor = parseFloat(msg.payload.toString());
    } else {
      chart = this.humChartOut;
      this.humOutdoor = parseFloat(msg.payload.toString());
    }
    let d = new Date();
    chart.data.labels.push(d.getHours() + ":" + d.getMinutes());
    chart.data.datasets[0].data.push(parseFloat(msg.payload.toString()));
    if (chart.data.datasets[0].data.length > 100) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
    chart.update();
  }

  handleCo2(msg: IMqttMessage, s: string) {
    let chart;
    if (s == "indoor") {
      chart = this.co2ChartIn;
      this.co2Indoor = parseFloat(msg.payload.toString());
    } else {
      chart = this.co2ChartOut;
      this.co2Outdoor = parseFloat(msg.payload.toString());
    }
    let d = new Date();
    chart.data.labels.push(d.getHours() + ":" + d.getMinutes());
    chart.data.datasets[0].data.push(parseFloat(msg.payload.toString()));
    if (chart.data.datasets[0].data.length > 100) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
    chart.update();
  }
}
