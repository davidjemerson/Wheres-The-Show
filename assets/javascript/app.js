
$("#copyright-year").text(moment().year());

// Collapses modal
$('#btn-primary').on('shown.bs.modal', function () {
    $('#myInput').focus()
  })