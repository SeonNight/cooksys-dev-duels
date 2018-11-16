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
  //Refresh Area
  $('#duel-error').addClass('hide')
  $('#error-left').addClass('hide')
  $('#error-right').addClass('hide')
  $('#winner-result').addClass("hide")
  $('.left').addClass('hide')
  $('.right').addClass('hide')
  $('.duel-container').removeClass('hide')
  $('.loading').removeClass('hide')
  $('.versus').addClass('hide')

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

  const addTitles = (which, titles) => {
    $(`${which} .titles`).text("")
    titles.forEach((titleInfo) => {
      $(`${which} .titles`).append(`<span class="tooltip"><img src="${titleInfo[2]}" alt="${titleInfo[0]}"/>
        <span class="tooltiptext">${titleInfo[1]}</span></span>`)
    })
  }

  // Fetch data for given user
  // (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  fetch(`${USER_URL}s?username=${usernameLeft}&username=${usernameRight}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(datas => {
      $('.loading').addClass('hide')
      let data = datas[0]
      if(data.status == 200) {
        $('.left .username').text(data.username)
        $('.left .full-name').text(data.name)
        $('.left .location').text(data.location)
        $('.left .email').text(data.email)
        $('.left .bio').text(data.bio)
        $('.left .avatar').attr("src",data.avatar_url)
        addTitles('.left',data.titles)
        $('.left .favorite-language').text(data.favorite_language)
        $('.left .total-stars').text(data.total_stars)
        $('.left .most-starred').text(data.highest_starred)
        $('.left .public-repos').text(data.public_repos)
        $('.left .perfect-repos').text(data.perfect_repos)
        $('.left .followers').text(data.followers)
        $('.left .following').text(data.following)
        $('.left').removeClass('hide')
      } else {
        $('#error-left').removeClass('hide')
        $('#error-left .error').text(usernameLeft + ' not found')
      }
      return datas[1]
      })
    .then(data => {
        if(data.status == 200) {
          $('.right .username').text(data.username)
          $('.right .full-name').text(data.name)
          $('.right .location').text(data.location)
          $('.right .email').text(data.email)
          $('.right .bio').text(data.bio)
          $('.right .avatar').attr("src",data.avatar_url)
          addTitles('.right',data.titles)
          $('.right .favorite-language').text(data.favorite_language)
          $('.right .total-stars').text(data.total_stars)
          $('.right .most-starred').text(data.highest_starred)
          $('.right .public-repos').text(data.public_repos)
          $('.right .perfect-repos').text(data.perfect_repos)
          $('.right .followers').text(data.followers)
          $('.right .following').text(data.following)
          $('.right').removeClass('hide')
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
      $('.versus').removeClass('hide')
      //Make sure there are no errors on either side
      if($('#error-right').hasClass("hide") && $('#error-left').hasClass("hide")){
        let pointRight = $('.right .titles').text().split(",").length * 10
        pointRight += Number($('.right .total-stars').text()) * 20
        pointRight += Number($('.right .highest-starred').text()) * 10
        pointRight += Number($('.right .public-repos').text()) * 10
        pointRight += Number($('.right .followers').text()) * 50
        pointRight += Number($('.right .following').text()) * 5

        let pointLeft = $('.left .titles').text().split(",").length * 10
        pointLeft += Number($('.left .total-stars').text()) * 20
        pointLeft += Number($('.left .highest-starred').text()) * 10
        pointLeft += Number($('.left .public-repos').text()) * 10
        pointLeft += Number($('.left .followers').text()) * 50
        pointLeft += Number($('.left .following').text()) * 5

        if(pointLeft > pointRight) {
          $('#winner-result .username').text($('.left .username').text())
        } else if (pointRight > pointLeft) {
          $('#winner-result .username').text($('.right .username').text())
        } else { //DRAW
          $('#winner-result .label').text("DRAW")
          $('#winner-result .username').text("")
        }
        //$('#winner-result').css("height",0)
        $('#winner-result').removeClass("hide")
        $('#winner-result').animate({
          opacity: 1,
          left: "+=50",
          height: "100%"
        }, 5000, function() {
          console.log("Done")
        })
        //Cards slide in from left and right
        //VERSES appear
        //Number of points appear on each attribute
        //Winner message appears
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
