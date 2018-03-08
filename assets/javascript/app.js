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
});

$("#copyright-year").text(moment().year());


$('#btn-primary').on('shown.bs.modal', function () {

	$('#myInput').focus()
})

var artistArray = [];

$("#add_artist").on('click', function (event) {
	event.preventDefault();
	var location = $("#location").val().trim();
	location = location.replace(/\s+/g, "+");
	console.log(location);
	var date = $("#date").val();
	console.log(date);
	var ticketmasterKey = "GMb9kWGBfHFrWOyKbZNww60Bsf54F5LU";
	// var eventfulKey = "KP59BCKSVm4x73p7";
	var youtubeKey = "AIzaSyD507r0h_zioKfSsE3U407o7pwH85aK3pg";
	// var youtubeDataQuery = "https://www.googleapis.com/youtube/v3/search?key=" + youtubeKey + "&part=snippet&q=" + artist + "&topicId=/m/04rlf";
	// console.log(youtubeDataQuery);
	var ticketmasterQuery = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + ticketmasterKey + "&classificationName=music&city=" + location;
	// var eventfulQuery = "http://api.eventful.com/json/events/search?app_key=" + eventfulKey + "&q=" + artist + "&location=" + location + "&c=music";
	// console.log(eventfulQuery);

	$.ajax({
		url: ticketmasterQuery,
		method: 'GET'
	}).then(function (object) {
		// console.log(object);
		for (var i = 0 ; i < object._embedded.events.length ; i++) {
			var event = object._embedded.events[i].name;
			var artist = object._embedded.events[i]._embedded.attractions["0"].name;
			// console.log("Artist Name: " + artist);
			var artistForSearch = artist.replace(/\s+/g, "+");
			var newArtist = {
				eventName: object._embedded.events[i].name,
				artistName: object._embedded.events[i]._embedded.attractions["0"].name,
				artistSearch: artist.replace(/\s+/g, "+")
			}
			// console.log(newArtist);
			artistArray.push(newArtist);
		}
		console.log(artistArray);
	})
})

$("#copyright-year").text(moment().year());