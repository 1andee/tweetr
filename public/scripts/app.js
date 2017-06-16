/*
* Client-side JS logic goes here
* jQuery is already loaded
* Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

$(document).ready(function () {


  // handle the new tweets
  let form = $(".new-tweet form");
  form.on("submit", (event) => {
    event.preventDefault();

    let userText = form.serialize().substring(5);
    if (!userText) {
      let response = `<span class="warning">Say something!</span>`
      $(".warning").html(response);
      return;
    } else if (userText.length > 140) {
      let response = `<span class="warning">You said too much!</span>`
      $(".warning").html(response);
      return;
    }
    else {
      let response = `<span class="warning"></span>`
      $(".warning").html(response);

      $.post({
        url: '/tweets',
        datatype: 'json',
        data: form.serialize(),
        success: () => {
          loadTweets(renderTweets)
        },
        fail: handleError('postNewTweet')
      })
    }
  });

  /**
  @description: error handler
  @params:
          method and error in question
  */
  const handleError = (method) => {
    return (err) => {
      console.debug(method, err);
    }
  }

  /**
  @description: fetches tweets from http://localhost:8080/tweets
  @params:
          cb for when tweets are loaded
  */
  const loadTweets = (cb) => {
    $.getJSON({
      url: '/tweets',
      success: (response) => {
        cb(response);
      },
      fail: handleError('loadTweets')
    })
  }

  /**
  @description: uses createTextNode() for XSS prevention
  @params:
          string
  */
  const escape = (str) => {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // @description: converts each tweet into HTML string and appends to page
  const renderTweets = (data) => {
    const tweet_feed = data.map((tweet) => {
      var timeElapsed = Math.floor((Date.now() - tweet.created_at)/(1000*60*60*24));
      return `
        <article class="tweet">
          <header>
              <span class="usericon">
              <img src="${tweet.user.avatars.small}">
              </span>
            <span class="usersname">
              ${tweet.user.name}
            </span>
            <span class="userid floatright">
              ${tweet.user.handle}
            </span>
          </header>
          <div class="tweetbody">
            ${escape(tweet.content.text)}
          </div>
            <footer>
              <span class="whatevs">
                ${timeElapsed} days ago
              </span>
              <span class="icons floatright">
                <i class="fa fa-heart fa-lg"></i>
                <i class="fa fa-retweet fa-lg"></i>
                <i class="fa fa-flag fa-lg"></i>
              </span>
            </footer>
        </article>`
    })
    $("#tweetList").append(tweet_feed.join(''));
  }

  // on page load
  loadTweets(renderTweets);

  // eventually, add a click listener (handler) to load more content on('click')

});
