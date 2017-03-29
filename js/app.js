var model = {
	locations: [
		{title: 'Rollbotto Sushi', location: {lat: 27.774163, lng: -82.6337226}},
		{title: "Skyway Jack's Restaurant", location: {lat: 27.7435622, lng: -82.679839}},
		{title: "Larry's Ice Crean & Gelatos", location: {lat: 27.7364418, lng: -82.74735029999999}},
		{title: 'Pass-A-Grille Beach', location: {lat: 27.6956855, lng: -82.73673719999999}},
		{title: "Mazzaro's Italian Market", location: {lat: 27.792417, lng: -82.673615}},
		{title: "Crawley's Downtown", location: {lat: 27.7712088, lng: -82.6367765}},
		{title: "Hook's Sushi Bar & Thai Food", location: {lat: 27.7837765, lng: -82.6469384}}
	]

}

// ViewModel
var viewModel = {
	locations: ko.observableArray(model.locations),

	openList: function() {
		var menu = document.querySelector('#menu');
		var list = document.querySelector('#list');
		var container = document.querySelector('#container');
		list.classList.toggle('open');
		if (document.getElementById("map").style.width == "75%") {
			document.getElementById("map").style.width = "100%";
		}
		else {
			document.getElementById("map").style.width = "75%";
		};
	}
};
ko.applyBindings(viewModel);

var view = {
	initMap: function() {
		var markers = [];
	    // Constructor creates a new map - only center and zoom are required.
		var map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 27.762315, lng: -82.695607},
			zoom: 12
		});

		var largeInfoWindow = new google.maps.InfoWindow();
		for (var i = 0; i < model.locations.length; i++){
			var position = model.locations[i].location;
			var title = model.locations[i].title;
			var marker = new google.maps.Marker({
				map: map,
				position: position,
				title: title,
				id: i
			});
			markers.push(marker);
			marker.addListener('click', function() {
				view.openInfoWindow(this, largeInfoWindow);
			});
		}
		google.maps.event.addDomListener(window, "resize", function() {
    		var center = map.getCenter();
    			google.maps.event.trigger(map, "resize");
    			map.setCenter(center); 
		});
	},
	openInfoWindow: function(marker, infowindow) {
		if (infowindow.marker != marker) {
			infowindow.marker = marker;
			infowindow.setContent('');
			infowindow.open(map, marker);
			infowindow.addListener('closeclick', function() {
				infowindow.setMarker = null;
			});
			var streetViewService = new google.maps.StreetViewService();
			var radius = 50;
			function getStreetView(data, status) {
				if (status == google.maps.StreetViewStatus.OK) {
					var nearStreetViewLocation = data.location.latLng;
					var heading = google.maps.geometry.spherical.computeHeading(
						nearStreetViewLocation, marker.position);
					infowindow.setContent('<div>' + marker.title + '</div><div id="streetview"></div>');
						var panoramaOptions = {
							position: nearStreetViewLocation,
							pov: {
								heading: heading,
								pitch: 30
							}
						};
					var panorama = new google.maps.StreetViewPanorama(
						document.getElementById('streetview'), panoramaOptions);
				} 
				else {
						infowindow.setContent('<div>' + marker.title + '</div>' +
							'<div>No Street View Found</div>');
				}
			}
			streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
			infowindow.open(map, marker);
		}
	}
};
