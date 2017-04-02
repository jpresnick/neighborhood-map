// model: initializes locations. each location has a title, lat/lng, and marker
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

// viewModel: contains all of the observables
var viewModel = {
	// filter is the text that gets typed into the search box, it updates automatically
	filter: ko.observable(''),

	// this function opens the list of locations whent he hamburger menu icon is clicked
	openList: function() {
		var menu = document.querySelector('#menu');
		var list = document.querySelector('#list');
		var container = document.querySelector('#container');
		list.classList.toggle('open');
		// resize map element when list is open
		if (document.getElementById("map").style.width == "75%") {
			document.getElementById("map").style.width = "100%";
		}
		else {
			document.getElementById("map").style.width = "75%";
		};
		// recenter map when list is open
		view.centerMap();
	},

	// when list item is clicked, trigger a click on the matching marker
	findMarker: function() {
		google.maps.event.trigger(this.marker, 'click');
	},

	// when a filter is applied, showFilteredListings will add just those markers to the map
	// when no filter is applied, it will add all markers to the map
	showFilteredListings: function() {
		for (var i = 0; i < view.markers.length; i++) {
			//if marker title starts with the same string that filter does
			if (filterText(view.markers[i].title.toLowerCase(), viewModel.filter())) {
				view.markers[i].setMap(view.map);
			}
		}
	},

	// hides all markers
	hideListings: function() {
		for (var i = 0; i < view.markers.length; i++) {
			view.markers[i].setMap(null);
		}
	},

	// contains the json returned from the Wunderground API
	forecastJSON: ko.observableArray([]),

	// parses the wunderground API response and adds the relevent info to forecastJSON
	getForcast: function($){
		jQuery(document).ready(function($){
			$.ajax({
				url: 'http://api.wunderground.com/api/e8145af40a88765c/forecast/q/FL/Saint_Petersburg.json',
				dataType: 'jsonp',
				success: function(parsed_json) {
					var json = parsed_json['forecast']['simpleforecast']['forecastday'];
					for (var i = 0; i < json.length; i++){
							viewModel.forecastJSON.push(json[i]);
					}
				}
			});
		});
	}
};

// contains the locations that match the current filter being applied
viewModel.filteredLocations = ko.computed(function() {
	var filter = this.filter();
	// if no filter, show all listings and all markers
	if (!filter) {
		if (document.readyState === 'complete'){
			viewModel.showFilteredListings();
		}
		return model.locations;
	}
	// if there is a filter, hide all listings and then show only filtered listings
	// and filter list results
	else {
		viewModel.hideListings();
		viewModel.showFilteredListings();
		var filtered = ko.utils.arrayFilter(model.locations, function(item) {
		});
		return filtered;
	}
}, viewModel);

// checks to see if a location title and the filter start with the same string
var filterText = function(string, filter) {
	if (filter.length > string.length)
		return False;
	return string.substring(0, filter.length) === filter;
}

// view contains the visual elements of the page
var view = {
	// holds the markers that have been added to the map
	markers : [],

	// holds the map and properties
	map: '',

	// holds the infowindow properties
	largeInfoWindow: '',

	// runs if google maps api is successfully loaded
	googleSuccess: function() {
		ko.applyBindings(viewModel);
		view.initMap();
		viewModel.getForcast();
	},

	// runs if google maps api cannot be loaded
	googleError: function() {
		viewModel.getForcast();
		alert("There was an error loading the page. Please check your internet connection or try again later.");
	},

	// initializes map and markers
	initMap: function() {
		// initalizes map, infowindow, and bounds
		view.map = new google.maps.Map(document.getElementById('map'));
		largeInfoWindow = new google.maps.InfoWindow();
		bounds = new google.maps.LatLngBounds();

		// loop through all of the locations and add a marker for each
		for (var i = 0; i < model.locations.length; i++){
			var position = model.locations[i].location;
			var title = model.locations[i].title;
			var marker = new google.maps.Marker({
				map: view.map,
				position: position,
				title: title,
				id: i
			});
			//a dd marker object back to locations variable
			model.locations[i].marker = marker;
			view.markers.push(marker);
			// if marker is clicked, open infowindow and bounce pin
			marker.addListener('click', function() {
				var self = this;
				view.openInfoWindow(self, largeInfoWindow);
				self.setAnimation(google.maps.Animation.BOUNCE);
    			setTimeout(function(){ self.setAnimation(null); }, 750);
			});
			//set map bounds to be a little bigger than extent of the markers
			bounds.extend(model.locations[i].location)
			bounds.f.b += .002;
		}
		view.map.fitBounds(bounds);
		//if browser is resized, map will recenter
		google.maps.event.addDomListener(window, "resize", function() {
    		view.centerMap();
		});
	},

	//centers map
	centerMap: function() {
		center = view.map.getCenter();
    	google.maps.event.trigger(view.map, "resize");
    	view.map.setCenter(center); 
	},

	//opens infowindow
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
			// gets streetview image for specified location, radius, pitch, and heading
			// and adds it to infowindow
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
				// if image not available, add message to infowindow
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

