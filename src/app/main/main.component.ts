import { Component, OnInit, AfterViewInit } from "@angular/core";
import { MqttService, IMqttMessage } from "ngx-mqtt";
import { Subscription } from "rxjs";
import { Chart } from "chart.js";
import { formatNumber } from "@angular/common";

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

  tempChart: Chart;
  humChart: Chart;
  presChart: Chart;
  co2Chart: Chart;
  pm10Chart: Chart;
  pm25Chart: Chart;

  tempIndoor = 0;
  tempOutdoor = 0;
  humIndoor = 0;
  humOutdoor = 0;
  co2Indoor = 0;
  co2Outdoor = 0;
  presIndoor = 0;
  presOutdoor = 0;
  pm10Outdoor = 0;
  pm25Outdoor = 0;

  now: Date = new Date();

  constructor(private _mqttService: MqttService) {}

  ngAfterViewInit() {
    setInterval(() => {
      this.now = new Date();
    }, 1000);

    /***
     * Temperatur
     ***/
    this.tempChart = new Chart(document.getElementById("tempChart"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Temperatur Innen",
            data: [],
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243,0.1)",
            fill: "origin",
            pointStyle: "line"
          },
          {
            label: "Temperatur Außen",
            data: [],
            borderColor: "#FF4136",
            backgroundColor: "rgba(255, 65, 54,0.1)",
            fill: "origin",
            pointStyle: "line"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        plugins: {
          filler: {
            propagate: true
          }
        },
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          yAxes: [
            {
              beforeFit: function(scale) {
                let maxValue = 0;
                let minValue = 100;
                if (
                  scale.chart.config &&
                  scale.chart.config.data &&
                  scale.chart.config.data.datasets
                ) {
                  scale.chart.config.data.datasets.forEach(dataset => {
                    if (dataset && dataset.data) {
                      dataset.data.forEach(value => {
                        if (value > maxValue) {
                          maxValue = value;
                        }
                        if (value < minValue) {
                          minValue = value;
                        }
                      });
                    }
                  });
                }
                scale.options.ticks.max = maxValue + 1;
                scale.options.ticks.min = minValue - 1;
              },
              display: true,
              ticks: {
                beginAtZero: false,
                maxTicksLimit: 5,
                precision: 0
              },
              padding: 4
            }
          ],
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 4
              }
            }
          ]
        }
      }
    });

    /***
     * Luftfeuchtigkeit
     ***/
    this.humChart = new Chart(document.getElementById("humChart"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Luftfeuchtigkeit Innen",
            data: [],
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243,0.1)",
            fill: "origin",
            pointStyle: "line"
          },
          {
            label: "Luftfeuchtigkeit Außen",
            data: [],
            borderColor: "#FF4136",
            backgroundColor: "rgba(255, 65, 54,0.1)",
            fill: "origin",
            pointStyle: "line"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        plugins: {
          filler: {
            propagate: true
          }
        },
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          yAxes: [
            {
              beforeFit: function(scale) {
                let maxValue = 0;
                let minValue = 100;
                if (
                  scale.chart.config &&
                  scale.chart.config.data &&
                  scale.chart.config.data.datasets
                ) {
                  scale.chart.config.data.datasets.forEach(dataset => {
                    if (dataset && dataset.data) {
                      dataset.data.forEach(value => {
                        if (value > maxValue) {
                          maxValue = value;
                        }
                        if (value < minValue) {
                          minValue = value;
                        }
                      });
                    }
                  });
                }
                scale.options.ticks.max = maxValue + 2;
                scale.options.ticks.min = minValue - 2;
              },
              display: true,
              ticks: {
                beginAtZero: false,
                maxTicksLimit: 5,
                precision: 0
              },
              padding: 4
            }
          ],
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 4
              }
            }
          ]
        }
      }
    });

    /***
     * Luftdruck
     ***/
    this.presChart = new Chart(document.getElementById("presChart"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Luftdruck Innen",
            data: [],
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243,0.1)",
            fill: "origin",
            pointStyle: "line"
          },
          {
            label: "Luftdruck Außen",
            data: [],
            borderColor: "#FF4136",
            backgroundColor: "rgba(255, 65, 54,0.1)",
            fill: "origin",
            pointStyle: "line"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        plugins: {
          filler: {
            propagate: true
          }
        },
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          yAxes: [
            {
              beforeFit: function(scale) {
                let maxValue = 0;
                let minValue = 2000;
                if (
                  scale.chart.config &&
                  scale.chart.config.data &&
                  scale.chart.config.data.datasets
                ) {
                  scale.chart.config.data.datasets.forEach(dataset => {
                    if (dataset && dataset.data) {
                      dataset.data.forEach(value => {
                        if (value > maxValue) {
                          maxValue = value;
                        }
                        if (value < minValue) {
                          minValue = value;
                        }
                      });
                    }
                  });
                }
                scale.options.ticks.max = maxValue + 2;
                scale.options.ticks.min = minValue - 2;
              },
              display: true,
              ticks: {
                beginAtZero: false,
                maxTicksLimit: 5,
                precision: 0
              },
              padding: 4
            }
          ],
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 4
              }
            }
          ]
        }
      }
    });

    /***
     * CO2
     ***/
    this.co2Chart = new Chart(document.getElementById("co2Chart"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Luftdruck Innen",
            data: [],
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243,0.1)",
            fill: "origin",
            pointStyle: "line"
          },
          {
            label: "Luftdruck Außen",
            data: [],
            borderColor: "#FF4136",
            backgroundColor: "rgba(255, 65, 54,0.1)",
            fill: "origin",
            pointStyle: "line"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        plugins: {
          filler: {
            propagate: true
          }
        },
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          yAxes: [
            {
              beforeFit: function(scale) {
                let maxValue = 0;
                let minValue = 10000;
                if (
                  scale.chart.config &&
                  scale.chart.config.data &&
                  scale.chart.config.data.datasets
                ) {
                  scale.chart.config.data.datasets.forEach(dataset => {
                    if (dataset && dataset.data) {
                      dataset.data.forEach(value => {
                        if (value > maxValue) {
                          maxValue = value;
                        }
                        if (value < minValue) {
                          minValue = value;
                        }
                      });
                    }
                  });
                }
                scale.options.ticks.max = maxValue + 50;
                scale.options.ticks.min = minValue - 50;
              },
              display: true,
              ticks: {
                beginAtZero: false,
                maxTicksLimit: 5,
                precision: 0
              },
              padding: 4
            }
          ],
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 4
              }
            }
          ]
        }
      }
    });

    /***
     * PM10
     ***/
    this.pm10Chart = new Chart(document.getElementById("pm10Chart"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Feinstaub PM10",
            data: [],
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243,0.1)",
            fill: "origin",
            pointStyle: "line"
          },
          {
            label: "Grenzwert",
            data: [],
            borderColor: "#FF4136",
            backgroundColor: "rgba(255, 65, 54,0.1)",
            fill: false,
            pointStyle: "line"
          },
          {
            label: "Hoher Wert",
            data: [],
            borderColor: "#FF851B",
            backgroundColor: "rgba(255, 65, 54,0.1)",
            fill: false,
            pointStyle: "line"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        plugins: {
          filler: {
            propagate: true
          }
        },
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                maxTicksLimit: 5,
                precision: 0,
                min: 0,
                max: 60
              },
              padding: 4
            }
          ],
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 4
              }
            }
          ]
        }
      }
    });

    /***
     * PM25
     ***/
    this.pm25Chart = new Chart(document.getElementById("pm25Chart"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Feinstaub PM10",
            data: [],
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243,0.1)",
            fill: "origin",
            pointStyle: "line"
          },
          {
            label: "Grenzwert",
            data: [],
            borderColor: "#FF4136",
            backgroundColor: "rgba(255, 65, 54,0.1)",
            fill: false,
            pointStyle: "line"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        plugins: {
          filler: {
            propagate: true
          }
        },
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                maxTicksLimit: 5,
                precision: 0,
                min: 0,
                max: 30
              },
              padding: 4
            }
          ],
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 4
              }
            }
          ]
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
    if (msg.topic == "umweltstation/indoor/temp") {
      this.handleTemp(msg, "indoor");
    }
    if (msg.topic == "umweltstation/indoor/hum") {
      this.handleHum(msg, "indoor");
    }
    if (msg.topic == "umweltstation/indoor/co2") {
      this.handleCo2(msg, "indoor");
    }
    if (msg.topic == "umweltstation/indoor/pres") {
      this.handlePres(msg, "indoor");
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
    if (msg.topic == "umweltstation/outdoor/pres") {
      this.handlePres(msg, "outdoor");
    }
    if (msg.topic == "umweltstation/outdoor/pm10") {
      this.handlePm10(msg);
    }
    if (msg.topic == "umweltstation/outdoor/pm25") {
      this.handlePm25(msg);
    }
  }

  handleTemp(msg: IMqttMessage, s: string) {
    let chart = this.tempChart;
    if (s == "indoor") {
      let d = new Date();
      let time =
        formatNumber(d.getHours(), "en", "2.0") +
        ":" +
        formatNumber(d.getMinutes(), "en", "2.0");
      chart.data.labels.push(time);
      chart.data.datasets[0].data.push(parseFloat(msg.payload.toString()));
      /*if (chart.data.datasets[0].data.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }*/
      this.tempIndoor = parseFloat(msg.payload.toString());
      chart.update();
    } else {
      let d = new Date();
      let time =
        formatNumber(d.getHours(), "en", "2.0") +
        ":" +
        formatNumber(d.getMinutes(), "en", "2.0");
      //chart.data.labels.push(time);
      chart.data.datasets[1].data.push(parseFloat(msg.payload.toString()));
      /*if (chart.data.datasets[0].data.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }*/
      this.tempOutdoor = parseFloat(msg.payload.toString());
      chart.update();
    }
    /*
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
    chart.update();*/
  }

  handleHum(msg: IMqttMessage, s: string) {
    let chart = this.humChart;
    if (s == "indoor") {
      let d = new Date();
      let time =
        formatNumber(d.getHours(), "en", "2.0") +
        ":" +
        formatNumber(d.getMinutes(), "en", "2.0");
      chart.data.labels.push(time);
      chart.data.datasets[0].data.push(parseFloat(msg.payload.toString()));
      /*if (chart.data.datasets[0].data.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }*/
      this.humIndoor = parseFloat(msg.payload.toString());
      chart.update();
    } else {
      let d = new Date();
      let time =
        formatNumber(d.getHours(), "en", "2.0") +
        ":" +
        formatNumber(d.getMinutes(), "en", "2.0");
      //chart.data.labels.push(time);
      chart.data.datasets[1].data.push(parseFloat(msg.payload.toString()));
      /*if (chart.data.datasets[0].data.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }*/
      this.humOutdoor = parseFloat(msg.payload.toString());
      chart.update();
    }
    /*
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
    chart.update();*/
  }

  handleCo2(msg: IMqttMessage, s: string) {
    let chart = this.co2Chart;
    if (s == "indoor") {
      let d = new Date();
      let time =
        formatNumber(d.getHours(), "en", "2.0") +
        ":" +
        formatNumber(d.getMinutes(), "en", "2.0");
      chart.data.labels.push(time);
      chart.data.datasets[0].data.push(parseFloat(msg.payload.toString()));
      /*if (chart.data.datasets[0].data.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }*/
      this.co2Indoor = parseFloat(msg.payload.toString());
      chart.update();
    } else {
      let d = new Date();
      let time =
        formatNumber(d.getHours(), "en", "2.0") +
        ":" +
        formatNumber(d.getMinutes(), "en", "2.0");
      //chart.data.labels.push(time);
      chart.data.datasets[1].data.push(parseFloat(msg.payload.toString()));
      if (
        chart.data.datasets[1].data.length < chart.data.datasets[0].data.length
      ) {
        for (
          let i = 0;
          i <
          chart.data.datasets[0].data.length -
            chart.data.datasets[1].data.length;
          i++
        ) {
          chart.data.datasets[1].data.push(parseFloat(msg.payload.toString()));
        }
      }
      /*if (chart.data.datasets[0].data.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }*/
      this.co2Outdoor = parseFloat(msg.payload.toString());
      chart.update();
    }
  }

  handlePres(msg: IMqttMessage, s: string) {
    let chart = this.presChart;
    if (s == "indoor") {
      let d = new Date();
      let time =
        formatNumber(d.getHours(), "en", "2.0") +
        ":" +
        formatNumber(d.getMinutes(), "en", "2.0");
      chart.data.labels.push(time);
      chart.data.datasets[0].data.push(parseFloat(msg.payload.toString()));
      /*if (chart.data.datasets[0].data.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }*/
      this.presIndoor = parseFloat(msg.payload.toString());
      chart.update();
    } else {
      let d = new Date();
      let time =
        formatNumber(d.getHours(), "en", "2.0") +
        ":" +
        formatNumber(d.getMinutes(), "en", "2.0");
      //chart.data.labels.push(time);
      chart.data.datasets[1].data.push(parseFloat(msg.payload.toString()));
      /*if (chart.data.datasets[0].data.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }*/
      this.presOutdoor = parseFloat(msg.payload.toString());
      chart.update();
    }
  }

  handlePm10(msg: IMqttMessage) {
    let chart = this.pm10Chart;
    let d = new Date();
    let time =
      formatNumber(d.getHours(), "en", "2.0") +
      ":" +
      formatNumber(d.getMinutes(), "en", "2.0");
    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(parseFloat(msg.payload.toString()));
    chart.data.datasets[1].data.push(50);
    chart.data.datasets[2].data.push(40);
    this.pm10Outdoor = parseFloat(msg.payload.toString());
    chart.update();
  }

  handlePm25(msg: IMqttMessage) {
    let chart = this.pm25Chart;
    let d = new Date();
    let time =
      formatNumber(d.getHours(), "en", "2.0") +
      ":" +
      formatNumber(d.getMinutes(), "en", "2.0");
    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(parseFloat(msg.payload.toString()));
    chart.data.datasets[1].data.push(25);
    this.pm25Outdoor = parseFloat(msg.payload.toString());
    chart.update();
  }
}
