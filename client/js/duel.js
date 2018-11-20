/* eslint-disable no-undef */
/*
  TODO
  Fetch 2 user's github data and display their profiles side by side
  If there is an error in finding user or both users, display appropriate error
  message stating which user(s) doesn't exist

  It is up to the student to choose how to determine a 'winner'
  and displaying their profile/stats comparison in a way that signifies who won.
 */

$('form').submit(() => {
  const usernameLeft = $('form [name=username-left]').val()
  const usernameRight = $('form [name=username-right]').val()

  //Clear all timeouts
  let length = id.length
  for (var i = 0 ; i < length ; i++) {
    clearTimeout(id.pop()); 
  }

  resetAnimations()

  //Refresh Area (hide or show what needs to be hidden or shown)
  $('#duel-error').addClass('hide')
  $('#error-left').addClass('hide')
  $('#error-right').addClass('hide')
  $('#winner-result').addClass("hide")
  $('.left').addClass('hide')
  $('.right').addClass('hide')
  $('.duel-container').removeClass('hide')
  $('.loading').removeClass('hide')
  $('.versus').addClass('hide')
  $('.score-containter').addClass('hide')

  //Make sure both left and right Names are given
  if(usernameLeft == "") {
    $('.loading').addClass('hide')
    $('#error-left').removeClass('hide')
    $('#error-left .error').text('Please Input Left Username')
    return false;
  } else if(usernameRight == "") {
    $('.loading').addClass('hide')
    $('#error-right').removeClass('hide')
    $('#error-right .error').text('Please Input Right Username')
    return false;
  }

  // Fetch data for given user
  // (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  fetch(`${USER_URL}s?username=${usernameLeft}&username=${usernameRight}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(datas => {
      $('.loading').addClass('hide')
      let data = datas[0]
      if(data.status == 200) {
        setData(data,'.left')
      } else {
        $('#error-left').removeClass('hide')
        $('#error-left .error').text(usernameLeft + ' not found')
      }
      return datas[1]
      })
    .then(data => {
        if(data.status == 200) {
          setData(data,'.right')
        } else {
          $('#error-right').removeClass('hide')
          $('#error-right .error').text(usernameRight + ' not found')
        }
      })
    .then(() => {
      //Scroll to the container
      $('html, body').animate({
          scrollTop: $('.duel-container').offset().top
      }, 500);
      //Make sure there are no errors on either side
      if($('#error-right').hasClass("hide") && $('#error-left').hasClass("hide")){
        //Set up score
        $('.score-container').removeClass('hide')
        $(`.score-container .left .score`).text(0)
        $(`.score-container .right .score`).text(0)
        //Make em all visible
        $('.versus').removeClass('hide')
        $('.left').removeClass('hide')
        $('.right').removeClass('hide')
        //Duel
        duel()
      }
    })
    .catch(err => {
      console.log(err)
      $('.duel-container').addClass('hide')
      $('#duel-error').removeClass('hide')
      $('#duel-error .error').text("ERROR")
    })

  return false // return false to prevent default form submission
})
