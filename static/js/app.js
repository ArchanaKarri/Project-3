// Get the samples.json endpoint

const mainUrl = "http://127.0.0.1:5000/main";


//-----------------------------Function to populate the initial page---------------------------------//

function init() {
  d3.json(mainUrl).then(function(data) {
    ids(data.Sites);
    addPie(data.Pie, data.Sites[0]);
    addBar(data.Bar, data.Sites[0]);
  });
}
//--------------------------------------------------------------//



//-----------------------------Function to populate the site list of Id's---------------------------------//

function ids(data) {

  // Iterate through all inputed data
  for (let i = 0; i < data.length; i++) {

    // set variable to create option element
    let added = document.createElement('option');

    // Set location of the new element as a variable
    let dataset = document.getElementById('selDataset');

    // though each iteration grab the data and save as value and html and then append to the location
    added.value = data[i];
    added.innerHTML = data[i];
    dataset.append(added);
  };
}
//--------------------------------------------------------------//



// ----------------------- Function to add the Pie chart to index.html ---------------------------  
function addPie(piedata, id) {

  // creating empty variables
  let label = [];
  let value = [];
  let colour = [];

  // Looping through data to find the site that matches
  for (let i = 0; i < piedata.length; i++) {
    if (piedata[i].site == id){
      label = piedata[i].Products;
      value = piedata[i].units;
      for (let i = 0; i < label.length; i++) {
        colour.push(getColor(label[i]));
    }}};

  // Set pie data based on the info from a specific site
  var data = [{
     type: "pie",
     values: value,
     labels: label,
     title: {text: `Site: ${id}`, 
     font: {
       size: 20,
       color: 'black'
     }},
     marker: {
      colors: colour
    },
     hole: 0.4,
     textinfo: "label+percent",
     insidetextorientation: "radial"
   }]
  
   // Apply layout parameters
   var layout = [{
     height: 700,
     width: 700
    }]

    let configPie = {responsive: true}

    Plotly.newPlot('pie', data, layout, configPie)
  };
//--------------------------------------------------------------//



//-----------------------------Function to be run when id has been changed and run functions using new id----------------------------------//
  
function optionChanged(id) {

  let currentId = id

  // Fetch the JSON data using url and run applicable functions          
    d3.json(mainUrl).then(function(data) {
      updatePie(data.Pie, currentId);
      addBar(data.Bar, currentId);
})};

//--------------------------------------------------------------//



// ----------------------- Test Map ---------------------------



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

//--------------------------------------------------------------//



// ----------------------- Function to add the Bar chart to index.html ---------------------------  

function addBar(bardata, id) {
  

  let data = collectBarData(bardata, id);

  var layout = {
    title: 'CMTP',
    xaxis: {
      tickangle: -90
    },
    barmode: 'group'
  };

let config = {responsive: true}

Plotly.newPlot("bar", data, layout, config);

};

//--------------------------------------------------------------//



// ----------------------- Function to update the Pie chart ---------------------------  
function updatePie(piedata, id) {

  // creating empty variables
  let label = [];
  let value = [];
  let colour = [];

  // Looping through data to find the site that matches
  for (let i = 0; i < piedata.length; i++) {
    if (piedata[i].site == id){
      label = piedata[i].Products;
      value = piedata[i].units;
      for (let i = 0; i < label.length; i++) {
        colour.push(getColor(label[i]));
    }}};

  let marker = {
      colors: colour
    };

  // Update the title text
  let title = {text: `Site: ${id}`, 
     font: {
       size: 20,
       color: 'black'
     }}
  
     // Restyle pie chart
    Plotly.restyle("pie", 'values', [value]);
    Plotly.restyle("pie", 'labels', [label]);
    Plotly.restyle("pie", 'title', [title]);
    Plotly.restyle("pie", 'marker', [marker]);
  };
//--------------------------------------------------------------//



//---------------------------------Function to Collect and Return Bar data specific to site selected-----------------------------//

function collectBarData(data, id) {
  // Initialize empty arrays 
  var barData = [];


  // Looping through data to find the id that matches
  for (let i = 0; i < data.length; i++) {
    if (data[i].site == id){

      // store id's data in dedicated arrays
      let siteDate  = data[i].Data;
      for (let i = 0; i < siteDate.length; i++) {
        if (siteDate[i].Period != ""){
          var trace = {
            x: siteDate[i].Period,
            y: siteDate[i].Values,
            type: 'bar',
            name: siteDate[i].Product,
            marker: {
              color: getColor(siteDate[i].Product),
              opacity: 0.7,
            }
          };
          barData.push(trace);
        }};
    };
  };

  return(barData);
 }
//--------------------------------------------------------------//



//---------------------------------Function to get colour -----------------------------//
function getColor(d) {
  return d == "BED" ? '#8dd3c7' :
         d == "BINS"  ? '#bc80bd' :
         d == "BULK"  ?  '#fdb462':
         d == "CARD"  ? '#fb8072' :
         d == "CASE"  ? '#80b1d3' :
         d == "PAL"   ? '#bebada':
         d == "PAL2"   ? '#b3de69':
         d == "PEN"   ? '#fccde5':
         '#d9d9d9';
};
//--------------------------------------------------------------//

init();