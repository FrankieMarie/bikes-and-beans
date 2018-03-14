var directionsService;
var directionsDisplay;
var routeBoxer;
var boxpolys;
var map;
var distance;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: map
    });
    var phoenix = {lat: 33.4484, lng: -112.0740};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: phoenix
    });

    routeBoxer = new RouteBoxer();

    var marker = new google.maps.Marker({
      position: phoenix,
      map: map
    }); 
    //calculate distance of draggable route
    directionsDisplay.addListener('directions_changed', function() {
      computeTotalDistance(directionsDisplay.getDirections(), "OK");
    });
    directionsDisplay.setMap(map);  
}


//grabbing submit button
let submit = document.getElementById('submit')
submit.addEventListener('click', ()=> {
    calcRoute();
});

//grabbing directions (steps) div
let directions = document.getElementById('steps')

// directions
let miles = document.getElementById('miles')
let coffee = document.getElementById('coffee')
let shop = document.getElementById('shop')
let hasSearched = false;

function calcRoute() {
    var start = document.getElementById('start').value;
    var destination = document.getElementById('destination').value;
    var request = {
      origin: start,
      destination: destination,
      travelMode: 'BICYCLING'
    };
    directionsService.route(request, (result, status)=>{
      directionsDisplay.setDirections(result);      
    });
  }
  function computeTotalDistance(result, status) {
    clearBoxes();
        let steps = result.routes[0].legs[0].steps
        let stepsText = ''
        for(let i=0; i<steps.length; i++){
            stepsText += [i+1] + ')' + ' ' + steps[i].instructions + `</br>`
        } 
        directions.innerHTML = stepsText
      let distance = result.routes[0].legs[0].distance.text
      document.getElementById('new_distance').innerHTML = result.routes[0].legs[0].distance.text;
      if (status == 'OK') {
        var path = result.routes[0].overview_path;
        var boxes = routeBoxer.box(path, 1);
        drawBoxes(boxes);
      }
  }
  
  // Draw the array of boxes as polylines on the map
  function drawBoxes(boxes) {
    boxpolys = new Array(boxes.length);
    for (var i = 0; i < boxes.length; i++) {
      boxpolys[i] = new google.maps.Rectangle({
        bounds: boxes[i],
        fillOpacity: 0,
        strokeOpacity: 1.0,
        strokeColor: '#FF0000',
        strokeWeight: 1,
        map: map
      });
    }
  }
  
  // Clear boxes currently on the map
  function clearBoxes() {
    if (boxpolys != null) {
      for (var i = 0; i < boxpolys.length; i++) {
        boxpolys[i].setMap(null);
      }
    }
    boxpolys = null;
  }

//set up autocomplete




//locate cafés and bike shops