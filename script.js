var directionsService;
var directionsDisplay;
var routeBoxer;
var boxpolys;
var map;
var distance;
var service;
var infoWindow;
var markers = [];

var cafeCheckbox = document.getElementById('coffee_checkbox');
var shopsCheckbox = document.getElementById('shops_checkbox');

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
      setTimeout(()=>{
          calcRoute();
      }, 200)    
});

//grabbing directions (steps) div
let directions = document.getElementById('steps')

// directions
let miles = document.getElementById('miles')
let coffee = document.getElementById('coffee')
let shop = document.getElementById('shop')

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
      //locate cafés and bike shops
      
      let request = {
        bounds:boxes[i],
        type: ['cafe']
      };
     // console.log(request)
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
    }
  }
// function callback (results, status){console.log(results)}
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        let place = results[i];
        markers.push(addMarker(results[i]));
      }
    }
  }
  function addMarker(place) {
    console.log(place)
    let iconImg = 'https://developers.google.com/maps/documentation/javascript/images/circle.png'
    if(place.types.includes('cafe')){
      //set coffee image to iconImg
      console.log('cafe')
    }
    else if(place.types.includes('bikes')){
      console.log('bike shop')
    }
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: {
        url: iconImg,
        anchor: new google.maps.Point(10, 10),
        scaledSize: new google.maps.Size(10, 17)
      }
    });
  
    google.maps.event.addListener(marker, 'click', function() {
      var request = {placeId: place.place_id};
  
      service.getDetails(request, function(result, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(result.name);
        infoWindow.open(map, marker);
      });
    });

    return marker
  }
  
  // Clear boxes currently on the map
  function clearBoxes() {
    for (let i = 0; i < markers.length; i++){
      markers[i].setMap(null);
    }
    markers = [];
    if (boxpolys != null) {
      for (var i = 0; i < boxpolys.length; i++) {
        boxpolys[i].setMap(null);
      }
    }
    boxpolys = null;
  }

//set up autocomplete