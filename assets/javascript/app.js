$(document).ready(function(){
  $('select').formSelect();
});

$("#copyright-year").text(moment().year());

// Collapses modal
$('#btn-primary').on('shown.bs.modal', function () {

    $('#myInput').focus()
  })

$("#add_artist").on('click', function(event) {
	event.preventDefault();
	var artist = $("#artist_name").val().trim();
	artist = artist.replace(/\s+/g,"+");
	console.log(artist);
	var location = $("#location").val().trim();
	location = location.replace(/\s+/g,"+");
	console.log(location);
	var ticketmasterKey = "GMb9kWGBfHFrWOyKbZNww60Bsf54F5LU";
	// var eventfulKey = "KP59BCKSVm4x73p7";
	var youtubeKey = "AIzaSyD507r0h_zioKfSsE3U407o7pwH85aK3pg";
	var youtubeDataQuery = "https://www.googleapis.com/youtube/v3/search?key=" + youtubeKey + "&part=snippet&q=" + artist + "&topicId=/m/04rlf";
	console.log(youtubeDataQuery);
	var ticketmasterQuery = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + ticketmasterKey + "&keyword=" + artist + "&classificationName=music&city=" + location;
	// var eventfulQuery = "http://api.eventful.com/json/events/search?app_key=" + eventfulKey + "&q=" + artist + "&location=" + location + "&c=music";
	// console.log(eventfulQuery);

	$.ajax({
		url: ticketmasterQuery,
		method: 'GET'
	}).then(function(object) {
		console.log(object);
	})

  $.ajax({
    url: youtubeDataQuery,
    method: 'GET'
  }).then(function (object) {
    console.log(object);
  })

})

$("#copyright-year").text(moment().year());
