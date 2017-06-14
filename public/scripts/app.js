/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(function() {

  // Test code. Eventually will get this from the server.
  var tweetData = {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1497116232227
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

  console.log(createTweetElement(tweetData));

  $(document).ready(function () {
    renderTweets([tweetData]);
  });

});
