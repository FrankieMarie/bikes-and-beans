var directionsService;
var directionsDisplay;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: map
    });
    var uluru = {lat: 33.4484, lng: -112.0740};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    }); 
    directionsDisplay.setMap(map);  
 
//locating cafés
    // var request = {
    //   location: center,
    //   readius: 8047,
    //   types: ['cafe']
    // };

    // var service = new google.maps.places.PlacesService(map);
    // service.nearbySearch(request, callback)
}

// function callback(results, status) {
//   if(status == google.maps.places.PlacesServiceStatus.OK){
//     for(var i=0; i<results.length; i++){
//       createMarker(results[i]);
//     }
//   }
// }

// function createMarker(place) {
//   var placeLoc = place.geometry.location;
//   var cafeMarker = new.google.maps.Marker({
//     map: map,
//     position: place.geometry.location
//   });
// }

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

function calcRoute() {
    var start = document.getElementById('start').value;
    var destination = document.getElementById('destination').value;
    var request = {
      origin: start,
      destination: destination,
      travelMode: 'BICYCLING'
    };
    directionsService.route(request, function(result, status) {
      console.log(result)
        let steps = result.routes[0].legs[0].steps
        for(let i=0; i<steps.length; i++){
            directions.innerHTML += [i+1] + ')' + ' ' + steps[i].instructions + `</br>`
        } 
      let distance = result.routes[0].legs[0].distance.text
      miles.innerHTML += ' ' + distance
      if (status == 'OK') {
        directionsDisplay.setDirections(result);
      }
    });
  }


//set up autocomplete


//calculate distance of draggable route


//locate cafés and bike shops