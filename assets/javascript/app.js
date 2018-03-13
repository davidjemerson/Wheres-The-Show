$(document).ready(function () {
	$('select').formSelect();
	$('.datepicker').datepicker();

	// Collapses modal
	$('.modal').modal();

	$('#modalTrigger').on('click', function () {
		$('#modal1').modal('open');
	});

	// Collapsible for main content
	$('.collapsible').collapsible();

	// For Parallax BKG
	$('.parallax').parallax();
});

$("#copyright-year").text(moment().year());


$('#btn-primary').on('shown.bs.modal', function () {

	$('#myInput').focus();
});

// holds the relevant results from the ticketmaster search
var artistArray = [];

var youtubeKey = "AIzaSyD507r0h_zioKfSsE3U407o7pwH85aK3pg";
var ticketmasterKey = "GMb9kWGBfHFrWOyKbZNww60Bsf54F5LU";

// for use with location services
// var userLocation = "empty";

// will hold the api url
var ticketmasterQuery = "";

// variables for the Google Places api
var reqLocation = "";
var cityInput = document.getElementById('location');
var autocomplete = new google.maps.places.Autocomplete(cityInput, { types: ['geocode'] });
var lat = "";
var long = "";
var date = "";

// watches the city field for updated entry and returns the latitude and longitude of the result
google.maps.event.addListener(autocomplete, 'place_changed', function () {
	reqLocation = autocomplete.getPlace();
	lat = reqLocation.geometry.location.lat();
	lng = reqLocation.geometry.location.lng();
})

// function logPosition(o) {
// 	userLocation = o;
// 	console.log(userLocation);
// }

// function logError(o) {
// 	console.log("failed to get user location");
// }

// navigator.geolocation.getCurrentPosition(logPosition, logError);

$("#detect-location").on("click", function () {
	$("#location").attr("placeholder", "Getting your current location...");
	if ("geolocation" in navigator){ //check geolocation available 
		//try to get user current location using getCurrentPosition() method
		navigator.geolocation.getCurrentPosition(function(position){ 
			console.log("Found your location \nLat : "+position.coords.latitude+" \nLang :"+ position.coords.longitude);
			lat = position.coords.latitude;
			lng = position.coords.longitude;
			$("#location").val(position.coords.latitude + ", " + position.coords.longitude);
		});
	}else{
		console.log("Browser doesn't support geolocation!");
		alert("Browser doesn't support geolocation!");
	};
});

// runs on each search
$("#search-for-shows").on('click', function (event) {
	event.preventDefault();

	// clears an previous search results
	artistArray = [];

	// in case the user doesn't take an autocomplete suggestion, this sets a city search variable and replaces spaces with +
	reqLocation = $("#location").val().trim();
	reqLocation = reqLocation.replace(/\s+/g, "+");

	// grabs the date and formats it for search using moment
	date = $("#date").val();
	if (date !== "") {
		var startDate = moment(date).format('YYYY-MM-DD') + "T00:00:00Z";
		var endDate = moment(date).add(14, 'days').format('YYYY-MM-DD') + "T00:00:00Z"
	}
	else {
		var startDate = moment().format('YYYY-MM-DD') + "T00:00:00Z";
		var endDate = moment().add(14, 'days').format('YYYY-MM-DD') + "T00:00:00Z"
		$("#date-label").addClass("active");
		$("#date").val(moment().format('MMM DD, YYYY'));
	}

	// if the user took a google suggestion we will have a lat value and not an empty string so we search by lat an lng. Otherwise we search by city name.
	if (lat !== "") {
		ticketmasterQuery = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + ticketmasterKey + "&classificationName=music&latlong=" + lat + "," + lng + "&radius=30&startDateTime=" + startDate + "&endDateTime=" + endDate + "&size=50&sort=date,desc";
	}
	else {
		ticketmasterQuery = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + ticketmasterKey + "&city=" + reqLocation + "&radius=50&classificationName=music&startDateTime=" + startDate + "&endDateTime=" + endDate + "&size=50&sort=date,desc";
	}

	// ajax call for the ticketmaster event data
	$.ajax({
		url: ticketmasterQuery,
		method: 'GET'
	}).then(function (object) {
		console.log(object);

		// this loop will go over each of the events returned in the JSON object
		for (var i = 0; i < object._embedded.events.length; i++) {
			var event = object._embedded.events[i].name;
			//var artist = object._embedded.events[i]._embedded.attractions[0].name;
			// console.log("Artist Name: " + artist);
			// var artistForSearch = event.replace(/\s+/g, "+");

			// creates an object for each event in returned data with just the info we need
			var newArtist = {
				eventName: event,
				artistName: event,

				// this is the term we will be using to search for our youtube video
				artistSearch: event.replace(/\s+/g, "+") + "+music",
				eventDate: object._embedded.events[i].dates.start.localDate,
				eventTime: object._embedded.events[i].dates.start.localTime,
				eventVenue: object._embedded.events[i]._embedded.venues[0].name,
				ticketmasterLink: object._embedded.events[i].url
			};
			// console.log(newArtist);

			// pushes each event object to the newArtist array
			artistArray.push(newArtist);
		};

		// checks to make sure we received results
		if (artistArray.length > 0) {

			// clears any previous search results from the page
			$("#showHolder").html("");

			// for each object in the array we create a new list item with relevant info. id is set to the term we will use in the youtube search below
			for (var i = 0; i < artistArray.length; i++) {
				var artistBlock = "<li id='" + artistArray[i].artistSearch + "' class='artist-name'><div class='collapsible-header valign-wrapper'><i class='material-icons md-36'>queue_music</i><h5>" + artistArray[i].eventName + "</h5></div><div class='collapsible-body'><div class=row><div class='col m4 s12 center'><a class='vid-link' href='' target=''><div class='video-container'><img class='thumbnail responsive-img' src=''></img><img class='playBtn' src='assets/images/ic_play_circle_outline_white_48dp_2x.png'></img></div></a></div><div class='col m8 s12'><dl><dt class='info'><h6>Info</h6></dt><dd><a href='" + artistArray[i].ticketmasterLink + "' target='_blank'>Event Details at TicketMaster</a></dd><br><dt class='dates'><h6>When</h6></dt><dd>" + moment(artistArray[i].eventDate + " " + artistArray[i].eventTime).format("dddd, MMMM Do YYYY, h:mm a") + "</dd><br><dt class='venue'><h6>Venue</h6></dt><dd>" + artistArray[i].eventVenue + "</dd></dl></div></div></div></li>";
				$("#showHolder").prepend(artistBlock);
			};
		};

	});

	$("#location").val("");
	$("#location").attr("placeholder", "Enter your location");
});

$("body").on('click', ".artist-name", function (event) {
	$(".thumbnail").attr("src", "");
	var currentArtist = $(this).attr("id");
	var listItem = $(this);
	console.log(currentArtist);
	var youtubeDataQuery = "https://www.googleapis.com/youtube/v3/search/?q=" + currentArtist + "&key=" + youtubeKey + "&part=snippet&type=video&videoCategoryId=10&maxResults=1";
	console.log(youtubeDataQuery);
	$.ajax({
		url: youtubeDataQuery,
		method: 'GET'
	}).then(function (object) {
		console.log(object);
		var vidId = object.items[0].id.videoId;
		var vidLink = "https://youtu.be/" + vidId;
		var vidThumb = object.items[0].snippet.thumbnails.medium.url;
		console.log(vidThumb);
		$(".vid-link").attr("href", vidLink);
		$(".vid-link").attr("target", '_blank');
		$(".thumbnail").attr("src", vidThumb);
	});
});

