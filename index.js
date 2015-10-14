var Keen = require('keen.io');
var tessel = require('tessel');
// attach the accelerometer to port A
var accel = require('accel-mma84').use(tessel.port['A']);
var count = 0;

console.log("setting up keen...");
// set up keen with your APIs here
var keen = Keen.configure({
    projectId: "###",
    writeKey: "###",
    readKey: "###",
    baseUrl: "http://api.keen.io/"
});

var dataArray = [];
accel.on('ready', function () {
  console.log("Accelerometer is ready!");
  // as we get data push it into an array
  accel.on('data', function (xyz) {
    dataArray.push(xyz);
  });
});

// every second send up all the accelerometer data
setTimeout(function sendData(){
  keen.addEvent("accel", {data: dataArray}, function(err){
    if (err) throw err;

    console.log("Added event #"+count, "data: ", dataArray);
    count++;
    dataArray = [];
    setTimeout(sendData, 1000);
  });
}, 1000);
