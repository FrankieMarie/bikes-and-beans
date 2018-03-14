var directionsService;
var directionsDisplay;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: map
    });
    var phoenix = {lat: 33.4484, lng: -112.0740};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: phoenix
    });
    var marker = new google.maps.Marker({
      position: phoenix,
      map: map
    }); 
    directionsDisplay.addListener('directions_changed', function() {
      computeTotalDistance(directionsDisplay.getDirections());
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

function calcRoute() {
    var start = document.getElementById('start').value;
    var destination = document.getElementById('destination').value;
    var request = {
      origin: start,
      destination: destination,
      travelMode: 'BICYCLING'
    };
    directionsService.route(request, computeTotalDistance);
  }
  function computeTotalDistance(result, status) {
    console.log(result)
        let steps = result.routes[0].legs[0].steps
        let stepsText = ''
        for(let i=0; i<steps.length; i++){
            stepsText += [i+1] + ')' + ' ' + steps[i].instructions + `</br>`
        } 
        directions.innerHTML = stepsText
      let distance = result.routes[0].legs[0].distance.text
      document.getElementById('new_distance').innerHTML = result.routes[0].legs[0].distance.text;
      if (status == 'OK') {
        directionsDisplay.setDirections(result);
      }
  }

//set up autocomplete


//calculate distance of draggable route


//locate cafés and bike shops