// Get the samples.json endpoint

const mainUrl = "http://127.0.0.1:5000/main";


  // Creating the map object
  var myMap = L.map("map", {
    center: [-28.865143, 135.209900],
    zoom: 5
  });

  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


//-----------------------------Function to populate the initial page---------------------------------//

function init() {
  d3.json(mainUrl).then(function(data) {
    ids(data.Sites);
    addPie(data.Pie, data.Sites[0]);
    addBar(data.Bar, data.Sites[0]);
    addMap(data.Sites[0]);
    sumInfo(data.summary, data.Sites[0]);
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



//-----------------------------Function to add summary Info---------------------------------//

function sumInfo(data, id){


  for (let i = 0; i < data.length; i++) {
    if (data[i].site == id){
      console.log(data[i]);

      // Set target element for data to be displayed
      let dataset = document.getElementById('sample-metadata');

      // set the html to nothing/blank
      dataset.innerHTML = "";

      // adding item to the html
      dataset.insertAdjacentHTML("beforeend", `<h2><strong>Site:</strong></h2>
      <h3>${getSite(data[i].site)}</h3>
      <hr />
      <h2><strong>Highest Delivered Product Type:</strong></h2>
      <h3>${getProduct(data[i].type_product)}</h3>
      <h3 id="product"></h3>
      <hr />
      <h2><strong>Highest Delivered Part:</strong></h2>
      <h3>${data[i].product_name}</h3>
      <h3 id="part"></h3>
      <hr />
      `);


      let animate_1 = anime({
        targets: "#product",
        innerHTML: [0, data[i].type_volume],
        duration: 1000,
        round: 1,
    });

    let animate_2 = anime({
      targets: "#part",
      innerHTML: [0, data[i].product_volume],
      duration: 1000,
      round: 1,
  });
    
    };};
  };
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
      removeMap(currentId);
      sumInfo(data.summary, currentId);
})};

//--------------------------------------------------------------//



//-----------------------------Function to remove Map object----------------------------------//
function removeMap(siteid) {
  myMap.remove();

  addBaseMap(siteid);
};
//--------------------------------------------------------------//



//----------------------------- Add tile layer to map ----------------------------------//

function addBaseMap(siteid) {

    // Creating the map object
    myMap = L.map("map", {
      center: [-28.865143, 135.209900],
      zoom: 5
    });
  
    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
  
    addMap(siteid);

};
 //--------------------------------------------------------------//


//----------------------------- Add choropleth layers to map ----------------------------------//

  function addMap(siteid) {

  mapUrl = `http://127.0.0.1:5000/map/${siteid}`

  let geojson;


  d3.json(mapUrl).then(function(data) {

  // Create a new choropleth layer.
  geojson = L.choropleth(data, {

    // Define which property in the features to use.
    valueProperty: "total",


    // Set the colour scale.
    scale: ["blue", "red"],

    // The number of breaks in the step range
    steps: 15,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border colour
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a popup to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(popup(feature));
    }
  }).addTo(myMap);
  myMap.fitBounds(geojson.getBounds());


  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = geojson.options.limits;
    let colors = geojson.options.colors;
    let labels = [];
    console.log(geojson.options)

    // Add the minimum and maximum.
    let legendInfo = "<h1>Units Delivered by Location<br />Site: " + getSite(siteid) +"</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
  });


};
//--------------------------------------------------------------//



// ----------------------- Function to add the Bar chart to index.html ---------------------------  

function addBar(bardata, id) {
  
 // Set data based on the info from a specific site
  let data = collectBarData(bardata, id);

  // Set layout for barchart
  var layout = {
    title: 'Delivery Qty by Product by Month',
    xaxis: {
      tickangle: -90
    },
    barmode: 'group',
    xaxis: {
      title: 'Periodic data(Month wise)'
        },
    yaxis: {
      title: 'Total quantity'
        }
  };

let config = {responsive: true}

// Adding the barchart to Html
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



//---------------------------------Function to get product name -----------------------------//
function getProduct(d) {
  return d == "BED" ? 'Bedding' :
         d == "BINS"  ? 'Bins' :
         d == "BULK"  ?  'Bulk Bins':
         d == "CARD"  ? 'Cardboard' :
         d == "CASE"  ? 'Cases' :
         d == "PAL"   ? 'Pallets':
         d == "PAL2"   ? 'Second-hand Pallets':
         d == "PEN"   ? 'Animal Pens':
         'Unknown';
};
//--------------------------------------------------------------//



//---------------------------------Function to get site name -----------------------------//
function getSite(d) {
  return d == "P01" ? 'Dandenong South' :
         d == "P02"  ? 'Dandenong South' :
         d == "P03"  ?  'Derrimut':
         d == "P04"  ? 'Albury' :
         d == "P05"  ? 'Branxholm' :
         d == "P07"   ? 'Colac':
         d == "P08"   ? 'Smeaton Grange':
         d == "P09"   ? 'Wetherill Park':
         d == "P11"   ? 'Edinburgh':
         d == "P12"   ? 'Yatala':
         d == "P13"   ? 'Brendale':
         d == "P14"   ? 'Mildura':
         'Unknown';
};
//--------------------------------------------------------------//



//---------------------------------Function to get text for popup -----------------------------//
function popup(feature) {
  let productList = feature.properties.byproduct;

  // Initialize empty array to hold the string values
  let string = []

  // loop through each product in the product list and append to string aray
  for (let i = 0; i < productList.length; i++) {
    string.push(`<br /> Total units of ${getProduct(productList[i].product)} delivered: ${productList[i].value}`)
  };

  return "<strong>Total Units Delivered: " + feature.properties.total + "</strong><hr />" + string
};

//--------------------------------------------------------------//

init();
