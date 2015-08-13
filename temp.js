/* 
 *  MediaTek LinkedItOne x PubNub Demo
 *  Displaying the data sent by a temperature sensor
 * 
 *  License: MIT
 */

/* Note to Paolo

Hey, this web interface displays one line graph from one sensor.

so when you publish the data from a sensor,
use the same publish_key subscribe_key, also the channel name ('linkitone-temperature')!
If you want a better channel name, you can change it, but let me know so I can change on my side too!

the JSON data you publish should look like:
{"temperature": 60.5}

The temperature value is a number (integer or whatever)

Should we display two graphs on one interface?
Is so, please published to two channels like,

linkeditone-temperature-wifi
linkeditone-temperature-gprs

and let me know. I'll change the UI quickly with the channel names!

*/


(function() {
  // When you're sending data from a sensor, you need to use the same pub and sub keys:
  var pubnub = PUBNUB.init({
    subscribe_key: 'sub-c-f1a8d734-df0c-11e4-962e-02ee2ddab7fe',
    publish_key: 'pub-c-f8ac677a-e6ce-4060-b0bf-d1c30fc45ba2'
  });

  var temperatuer = eon.chart({
    history: true,
    channel: 'linkitone-temperature', // The channel name should be matched too!
    padding: {
      left: 100
    },
    flow: {
      duration: 200
    },
    limit: 20,
    generate: {
      bindto: '#chart',
      data: {
        x: 'timestamp',
        xFormat: '%Y-%m-%d %H:%M:%S',
        labels: false
      },
      size: {
        height: 440
      },
      legend: {
        show: false
      },
      axis : {
        x : {
          type : 'timeseries',
          localtime: true,
          tick: {
            format: '%H:%M:%S'
          }
        },
        y: {
          default: [40, 100],
          count: 10
        }
      }
    },
    transform: function(m) {
      return {columns: [
        ['timestamp', new Date().getTime()],
        ['Temperature', m.temperature]
      ]};
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
      displayTemperature(currentTemp);
    },
    pubnub: pubnub
  });
})();