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

	$('#myInput').focus()
})

var artistArray = [];
var youtubeKey = "AIzaSyD507r0h_zioKfSsE3U407o7pwH85aK3pg";
var ticketmasterKey = "GMb9kWGBfHFrWOyKbZNww60Bsf54F5LU";

$("#add_artist").on('click', function (event) {
	event.preventDefault();
	var location = $("#location").val().trim();
	location = location.replace(/\s+/g, "+");
	console.log(location);
	var date = $("#date").val();
	var startDate = moment(date).format('YYYY-MM-DD') + "T00:00:00Z";
	var endDate = moment(date).add(1, 'month').format('YYYY-MM-DD') + "T00:00:00Z"
	console.log(date);
	var ticketmasterQuery = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + ticketmasterKey + "&classificationName=music&city=" + location + "&startDateTime=" + startDate + "&endDateTime=" + endDate + "&size=10";

	$.ajax({
		url: ticketmasterQuery,
		method: 'GET'
	}).then(function (object) {
		console.log(object);
		for (var i = 0 ; i < object._embedded.events.length ; i++) {
			var event = object._embedded.events[i].name;
			var artist = object._embedded.events[i]._embedded.attractions["0"].name;
			// console.log("Artist Name: " + artist);
			var artistForSearch = artist.replace(/\s+/g, "+");
			var newArtist = {
				eventName: object._embedded.events[i].name,
				artistName: object._embedded.events[i]._embedded.attractions["0"].name,
				artistSearch: artist.replace(/\s+/g, "+") + "+music",
				eventDate: object._embedded.events[i].dates.start.localDate,
				eventTime: object._embedded.events[i].dates.start.localTime,
				eventVenue: object._embedded.events[i]._embedded.venues["0"].name,
				ticketmasterLink: object._embedded.events[i].url
			}
			// console.log(newArtist);
			artistArray.push(newArtist);
		}
		console.log(artistArray);

		if (artistArray.length > 0) {
			$("#showHolder").html("");
			for (var i = 0 ; i < artistArray.length ; i++) {
				var artistBlock = "<li id='" + artistArray[i].artistSearch + "' class='artist-name'><div class='collapsible-header valign-wrapper'><i class='material-icons md-36'>queue_music</i><h5>" + artistArray[i].eventName + "</h5></div><div class='collapsible-body'><div class=row><div class='col m4 s12'><img class='thumbnail' src='http://via.placeholder.com/256x144'></img><p class='no-margin center-align'>(click thumbnail to open video)</p></div><div class='col m8 s12'><dl><dt class='info'><h6>Info</h6></dt><dd><a href='" + artistArray[i].ticketmasterLink + "' target='_blank'>Event Details at TicketMaster</a></dd><br><dt class='dates'><h6>When</h6></dt><dd>" + moment(artistArray[i].eventDate + " " + artistArray[i].eventTime).format("dddd, MMMM Do YYYY, h:mm a") + "</dd><br><dt class='venue'><h6>Venue</h6></dt><dd>" + artistArray[i].eventVenue + "</dd></dl></div></div></div></li>";
				$("#showHolder").prepend(artistBlock);
			}
		}

	})
})

$("body").on('click', ".artist-name", function (event) {
	var currentArtist = $(this).attr("id");
	var listItem = $(this);
	console.log(currentArtist);
	var youtubeDataQuery = "https://www.googleapis.com/youtube/v3/search/?q=" + currentArtist + "&key=" + youtubeKey + "&part=snippet&type=video&videoCategoryId=10&maxResults=1";
	console.log(youtubeDataQuery);
	$.ajax({
		url: youtubeDataQuery,
		method: 'GET'
	}).then(function (object) {
		var vidThumb = object.items[0].snippet.thumbnails.medium.url;
		console.log(vidThumb);
	})
})

$("#copyright-year").text(moment().year());