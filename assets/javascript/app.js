$(document).ready(function(){
  $('select').formSelect();
});

$("#copyright-year").text(moment().year());

// Collapses modal
$( document ).ready(function() {
  $('.modal').modal();
  
  $('#modalTrigger').on('click', function() {
    $('#modal1').modal('open');
  });
});
