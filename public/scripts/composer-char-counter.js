$(document).ready(function () {
  $( ".new-tweet textarea" ).keyup(function() {
    charactersRemaining = (140 - (this.value.length));
    $(this).siblings('.counter').text(charactersRemaining);

    if (charactersRemaining < 0) {
      $(".counter").addClass( "red" );
    } else {
      $(".counter").removeClass( "red" );
    };
  });
});
