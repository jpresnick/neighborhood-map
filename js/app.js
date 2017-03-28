var Model = function() {


}

var ViewModel = function() {

}

var View = function() {

}







// Creates the map
var map;
var markers = [];
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 27.762315, lng: -82.695607},
		zoom: 12
	});
	var locations = [
		{title: 'Rollbotto Sushi', location: {lat: 27.774163, lng: -82.6337226}},
		{title: "Skyway Jack's Restaurant", location: {lat: 27.7435622, lng: -82.679839}},
		{title: "Larry's Ice Crean & Gelatos", location: {lat: 27.7364418, lng: -82.74735029999999}},
		{title: 'Pass-A-Grille Beach', location: {lat: 27.6956855, lng: -82.73673719999999}},
		{title: "Mazzaro's Italian Market", location: {lat: 27.792417, lng: -82.673615}},
		{title: "Crawley's Downtown", location: {lat: 27.7712088, lng: -82.6367765}}
	];

	for (var i = 0; i < locations.length; i++){
		var position = locations[i].location;
		var title = locations[i].title;
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			id: i
		});
		markers.push(marker);
	}

}

// This block of code contains the functionality for the slide out list
var menu = document.querySelector('#menu');
var list = document.querySelector('#list');
var container = document.querySelector('#container');
menu.addEventListener('click', function(e) {
	list.classList.toggle('open');
	if (document.getElementById("map").style.width == "75%") {
		document.getElementById("map").style.width = "100%";
	}
	else {
		document.getElementById("map").style.width = "75%";
	};
	e.stopPropagation();
});
container.addEventListener('click', function() {
	list.classList.remove('open');
	document.getElementById('map').style.width = "100%";
});