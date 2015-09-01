/* 
 *  MediaTek LinkItOne x PubNub Demo
 *  Displaying the data sent by LinkItOne temperature sensors
 * 
 *  License: MIT
 */

(function() {
  'use strict';

  var channel = 'linkitone-temperature';

  var firstRun = true;
  var initTemp = 0;

  var prevTemp = 0;
  var max = 80;

  function plotGraph(pubnub) {
    // Eon
    var chart = eon.chart({
      channel: channel,
      padding: {
        left: 100
      },
      flow: {
        duration: 200
      },
      limit: 12,
      generate: {
        bindto: '#chart',
        data: {
          //x: 'timestamp',
          labels: true,
          colors: {
            temperature: 'orange'
          },
          axes: {
            temperature: 'y',
            pressure: 'y2'
          }
        },
        // size: {
        //   height: 440
        // },
        legend: {
          show: true
        },
        axis : {
          y: {
            // max: 100,
            // min: 50,
            label: {
              text: 'Temperature [C°]',
              position: 'outer-top'
            }
          },
          y2: {
            show: true,
            max: 1200,
            min: 600,
            label: {
              text: 'Pressure [hPa]',
              position: 'outer-top'
            }
          },
          x : {
            //type : 'timeseries',
            //localtime: true,
            label: 'Time',
            tick: {
              format: '%H:%M:%S'
            },
          }
        }
      },
      transform: function(m) {
        if(m.pressure) {
          return {columns: [
            ['temperature', m.pressure.toFixed(1)],
            ['pressure', m.pressure/100]
          ]};
        } else {
          return {columns: [
            ['temperature', m.temperature]
        ]};
        }
        
      },
      connect: function(m) {
        console.log('eon connected to: '+ m);
      },
      message: function(m) {
        var currentTemp = m.columns[0][1];

        if(firstRun) { 
          max = parseInt(currentTemp) + 20; 
          chart.axis.max({y: max});
          chart.axis.min({y: max - 35});
          firstRun = false;
        }

        if(currentTemp > max) { 
          chart.axis.max({y: parseInt(currentTemp) + 5});
        }
      },
      pubnub: pubnub
    });
    
  }

  function connect() {
    var pubnub = PUBNUB.init({
      subscribe_key: 'sub-c-c93e83ea-30c7-11e5-b3fa-02ee2ddab7fe',
      publish_key: 'pub-c-d3e5527d-c6ab-484a-a895-9b97cf52f683'
    });

    plotGraph(pubnub);    
    
  }

  connect();

})();