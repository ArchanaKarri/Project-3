// Get the samples.json endpoint
const url = "http://127.0.0.1:5000/api/sa3";

d3.json(url).then(function(data) {
  console.log(data)
});

// ----------------------- Test Map ---------------------------

console.log("Testing connection")

// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
let myMap = L.map("map", {
    center: [-28.01, 153.4],
    zoom: 13
  });

  // Adding a tile layer (the background map image) to our map:
  // We use the addTo() method to add objects to our map.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Creating a new marker:
  // We pass in some initial options, and then add the marker to the map by using the addTo() method.
  let marker = L.marker([-28.01, 153.4], {
    draggable: true,
    title: "My First Marker"
  }).addTo(myMap);
  
  // Binding a popup to our marker
  marker.bindPopup("Hello There!");


// ----------------------- Test Bar ---------------------------  
var trace1 = {
    x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    y: [20, 14, 25, 16, 18, 22, 19, 15, 12, 16, 14, 17],
    type: 'bar',
    name: 'Primary Product',
    marker: {
      color: 'rgb(49,130,189)',
      opacity: 0.7,
    }
  };
  
  var trace2 = {
    x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    y: [19, 14, 22, 14, 16, 19, 15, 14, 10, 12, 12, 16],
    type: 'bar',
    name: 'Secondary Product',
    marker: {
      color: 'rgb(204,204,204)',
      opacity: 0.5
    }
  };
  
  var data = [trace1, trace2];
  
  var layout = {
    title: '2013 Sales Report',
    xaxis: {
      tickangle: -45
    },
    barmode: 'group'
  };

let config = {responsive: true}

Plotly.newPlot("bar", data, layout, config);

// ----------------------- Test pie ---------------------------  

var data = [{
    type: "pie",
    values: [2, 3, 4, 4],
    labels: ["Wages", "Operating expenses", "Cost of sales", "Insurance"],
    textinfo: "label+percent",
    insidetextorientation: "radial"
  }]
  
  var layout = [{
    height: 700,
    width: 700
  }]

  let configPie = {responsive: true}

  Plotly.newPlot('pie', data, layout, configPie)