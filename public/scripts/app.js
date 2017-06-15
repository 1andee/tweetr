/*
* Client-side JS logic goes here
* jQuery is already loaded
* Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

$(document).ready(function () {

  // Test code. Eventually will get this from the server.
  var tweetData = {
  }

  // handle the new tweets
    $(".new-tweet").on("submit", function(event) {
      event.preventDefault();
      $(this).serialize();
    })

  function loadTweets() {
    //  fetch tweets from http://localhost:8080/tweets
    //  use jQuery to request /tweets and receive the array as JSON
    $.ajax({
      method: 'GET',
      url: '/tweets',
      dataType: 'JSON',
      success: function (tweetData) {
        renderTweets(tweetData);
      },
      fail: (err) => {
        console.debug('Something blew up', err);
      }
    });
  }

  function renderTweets(tweets) {
    for (var i = 0; i < tweets.length; i++) {
      $("#tweetList").append(createTweetElement(tweets[i]))
    }
  }

  function createTweetElement(tweet) {
    var timeElapsed = Math.floor((Date.now() - tweet.created_at)/(1000*60*60*24));

    var $tweet = $('<article>').addClass('tweet')
    .append(
      $("<header>")
      .append($("<img>").addClass('usericon').attr("src", tweet.user.avatars.small))
      .append($("<span>").addClass('usersname').text(tweet.user.name))
      .append($("<span>").addClass('userid floatright').text(tweet.user.handle))
    )
    .append(
      $("<div>").addClass("tweetbody")
      .append($("<p>").text(tweet.content.text))
    )
    .append(
      $("<footer>")
      .append($("<span>").text(timeElapsed + ' days ago'))
      .append($("<span>").addClass("icons floatright").html('<i class="fa fa-heart fa-lg"></i><i class="fa fa-retweet fa-lg"></i><i class="fa fa-flag fa-lg"></i>'))
    );
    return $tweet;
  }

  loadTweets();
  renderTweets(tweetData);
});
