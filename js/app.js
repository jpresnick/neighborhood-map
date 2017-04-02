var model = {
	locations: [
		{title: 'Rollbotto Sushi', location: {lat: 27.774163, lng: -82.6337226}, marker: null},
		{title: "Skyway Jack's Restaurant", location: {lat: 27.7435622, lng: -82.679839}, marker: null},
		{title: "Larry's Ice Crean & Gelatos", location: {lat: 27.7364418, lng: -82.74735029999999}, marker: null},
		{title: 'Pass-A-Grille Beach', location: {lat: 27.6956855, lng: -82.73673719999999}, marker: null},
		{title: "Mazzaro's Italian Market", location: {lat: 27.792417, lng: -82.673615}, marker: null},
		{title: "Crawley's Downtown", location: {lat: 27.7712088, lng: -82.6367765}, marker: null},
		{title: "Hook's Sushi Bar & Thai Food", location: {lat: 27.7837765, lng: -82.6469384}, marker: null}
	]

}

// ViewModel
var viewModel = {
	filter: ko.observable(''),

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
		view.centerMap();
	},
	findMarker: function() {
		google.maps.event.trigger(this.marker, 'click');
	},
	showFilteredListings: function() {
		for (var i = 0; i < view.markers.length; i++) {
			if (filterText(view.markers[i].title.toLowerCase(), viewModel.filter())) {
				view.markers[i].setMap(view.map);
			}
		}
	},
	hideListings: function() {
		for (var i = 0; i < view.markers.length; i++) {
			view.markers[i].setMap(null);
		}
	},
	forecastJSON: ko.observableArray([]),
	getForcast: function($){
		jQuery(document).ready(function($){
			$.ajax({
				url: 'http://api.wunderground.com/api/e8145af40a88765c/forecast/q/FL/ST_Petersburg.json',
				dataType: 'jsonp',
				success: function(parsed_json) {
					viewModel.forecastJSON = parsed_json['forecast']['txt_forecast']['forecastday'];
					for (var i = 0; i < viewModel.forecastJSON.length; i++){
						console.log(viewModel.forecastJSON[i]['icon_url']);
					}
				}
			});
		});
	}
};
viewModel.filteredLocations = ko.computed(function() {
	var filter = this.filter();
	if (!filter) {
		if (document.readyState === 'complete'){
			viewModel.showFilteredListings();
		}
		return model.locations;
	}	
	else {
		viewModel.hideListings();
		viewModel.showFilteredListings();
		var filtered = ko.utils.arrayFilter(model.locations, function(item) {
			return filterText(item.title.toLowerCase(), filter);
		});
		return filtered;
	}
}, viewModel);
var filterText = function(string, filter) {
	if (filter.length > string.length)
		return False;
	return string.substring(0, filter.length) === filter;
}
ko.applyBindings(viewModel);

var view = {
	markers : [],
	map: '',
	largeInfoWindow: '',
	initMap: function() {
	    // Constructor creates a new map - only center and zoom are required.
		view.map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 27.75000, lng: -82.695607},
			zoom: 12
		});

		largeInfoWindow = new google.maps.InfoWindow();
		bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < model.locations.length; i++){
			var position = model.locations[i].location;
			var title = model.locations[i].title;
			var marker = new google.maps.Marker({
				map: view.map,
				position: position,
				title: title,
				id: i
			});
			model.locations[i].marker = marker;
			view.markers.push(marker);
			marker.addListener('click', function() {
				var self = this;
				view.openInfoWindow(self, largeInfoWindow);
				self.setAnimation(google.maps.Animation.BOUNCE);
    			setTimeout(function(){ self.setAnimation(null); }, 750);
			});
			bounds.extend(model.locations[i].location)
		}
		view.map.fitBounds(bounds);
		google.maps.event.addDomListener(window, "resize", function() {
    		view.centerMap();
		});
		viewModel.getForcast();
	},
	centerMap: function() {
		center = view.map.getCenter();
    	google.maps.event.trigger(view.map, "resize");
    	view.map.setCenter(center); 
	},
	openInfoWindow: function(marker, infowindow) {
		if (infowindow.marker != marker) {
			infowindow.marker = marker;
			infowindow.setContent('');
			infowindow.open(view.map, marker);
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
			infowindow.open(view.map, marker);
		}
	}
};

