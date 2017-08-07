$(document).ready(function () {


  // /**
  // @description: checks to see if user is logged in
  // */
  // const userLoginState = () => {
  //   if (!req.session.user_id) {
  //     let response = $("#navbar").append(renderLoginButtons());
  //   }
  // }
  //
  // /**
  // @description: renders buttons if user is not logged in
  // */
  // const renderLoginButtons = () => {
  //   return `
  //   <span class="floatright"><button value="Login">Login</span>
  //   <span class="floatright"><button value="Register">Register</span>`
  //   // <span class="floatright"><button value="Logout">Logout</span>
  // }

  // slider animation for compose button
  $("#compose").on("click", () => {
    $(".new-tweet").slideToggle();
    $(".new-tweet textarea").focus();
  })

  $("#logout").on("click", () => {
    $.post({
      url: '/users/logout',
      success: () => {
        location.href = "/"
      },
      fail: handleError('logout')
    })
  });

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
  @description: event handler for new tweets
  @params: none
  */
  const postNewTweet = () => {
    let form = $(".new-tweet form");
    form.on("submit", (event) => {
      event.preventDefault();
      let userText = form.serialize().substring(5);

      if (lengthChecker(userText) === true) {
        $.post({
          url: '/tweets',
          datatype: 'json',
          data: form.serialize(),
          success: (data) => {
            resetComposeBox();
            $("#tweetList").prepend(renderTweets(data));
          },
          fail: handleError('postNewTweet')
        })
      }
    })
  }

  /**
  @description: checks that a new tweet is the correct length.
  @params: newtweet
  */
  const lengthChecker = (newtweet) => {
    if (!newtweet) {
      let response = `<span class="warning">${tooShort()}</span>`
      $(".warning").html(response);
      return false;
    } else if (newtweet.length > 140) {
      let response = `<span class="warning">${tooLong()}</span>`
      $(".warning").html(response);
      return false;
    }
    else return true;
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
  @description: resets the compose (new-tweet) area to default state
  */
  const resetComposeBox = () => {
    let response = `<span class="warning"></span>`;
    $(".warning").html(response);
    $(".counter").html(`<span class="counter">140</span>`);
    $(".new-tweet textarea").val('').blur();
  }

  /**
  @description: fetches tweets from http://localhost:8080/tweets
  @params: cb for when tweets are loaded
  */
  const loadTweets = (cb) => {
    $.getJSON({
      url: '/tweets',
      success: (response) => {
        // Sorts all tweets in reverse chronological order
        cb(response.reverse());
      },
      fail: handleError('loadTweets')
    })
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
      <span>${escape(tweet.content.text)}</span>
    </div>
    <footer>
      <span class="timestamp">
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
  postNewTweet();
});
