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
          }
        },
        size: {
          height: 440
        },
        legend: {
          show: false
        },
        axis : {
          y: {
            label: {
             text: 'Temperature [C°]',
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
            ['temperature', m.temperature],
            ['pressure', m.pressure]
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
      subscribe_key: 'sub-c-f1a8d734-df0c-11e4-962e-02ee2ddab7fe',
      publish_key: 'pub-c-f8ac677a-e6ce-4060-b0bf-d1c30fc45ba2'
    });

    plotGraph(pubnub);    
    
  }

  connect();

})();