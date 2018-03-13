var directionsService;
var directionsDisplay;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
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
}

//grabbing submit button
let submit = document.getElementById('submit')
submit.addEventListener('click', ()=> {
    calcRoute();
});

// directions
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
      if (status == 'OK') {
        directionsDisplay.setDirections(result);
      }
    });
  }