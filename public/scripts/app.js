$(document).ready(function () {

  // slider for compose button
  $(".compose").on("click", () => {
    $(".new-tweet").slideToggle();
    $(".new-tweet textarea").focus();
  })

  /**
  @description: error handler
  @params: method and error
  */
  const handleError = (method) => {
    return (err) => {
      console.debug(method, err);
    }
  }

  /**
  @description: posts new tweets from compose box (.new-tweet)
  @params: form data
  */
  let form = $(".new-tweet form");
  form.on("submit", (event) => {
    event.preventDefault();

    let userText = form.serialize().substring(5);
    if (!userText) {
      let response = `<span class="warning">Say something!</span>`
      $(".warning").html(response);
      return;
    } else if (userText.length > 140) {
      let response = `<span class="warning">Brevity is the soul of wit</span>`
      $(".warning").html(response);
      return;
    }
    else {
      let response = `<span class="warning"></span>`
      $(".warning").html(response);
      let newTweet = form.serialize();

      $.post({
        url: '/tweets',
        datatype: 'json',
        data: form.serialize(),
        success: (data) => {
          $(".new-tweet textarea").val('').blur();
          $(".counter").html(`<span class="counter">140</span>`);
          $("#tweetList").prepend(renderTweets(data));
        },
        fail: handleError('postNewTweet')
      })
    }
  });


  /**
  @description: fetches tweets from http://localhost:8080/tweets
  @params: cb for when tweets are loaded
  */
  const loadTweets = (cb) => {
    $.getJSON({
      url: '/tweets',
      success: (response) => {
        cb(response.reverse());
      },
      fail: handleError('loadTweets')
    })
  }

  /**
  @description: applies createTextNode() to new tweets for XSS prevention
  @params: string (text of new tweet composed by user)
  */
  const escape = (str) => {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
  @description: renders all existing tweets in DB and injects them to page
  @params: data
  */
  const renderAllTweets = (data) => {
    const tweet_feed = data.map((tweet) => {
      return renderTweets(tweet);
    })
    $("#tweetList").prepend(tweet_feed.join(''));
  }

  /**
  @description: converts a single tweet into HTML string
  @params: tweet to format
  */
  const renderTweets = (tweet) => {
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
        Posted ${timeElapsed(tweet.created_at)}
      </span>
      <span class="icons floatright">
        <i class="fa fa-heart fa-lg"></i>
        <i class="fa fa-retweet fa-lg"></i>
        <i class="fa fa-flag fa-lg"></i>
      </span>
    </footer>
    </article>`
  }

  // on page load
  loadTweets(renderAllTweets);

});
