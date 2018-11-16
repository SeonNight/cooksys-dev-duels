/* eslint-disable no-undef */
/*
  TODO
  Fetch 2 user's github data and display their profiles side by side
  If there is an error in finding user or both users, display appropriate error
  message stating which user(s) doesn't exist

  It is up to the student to choose how to determine a 'winner'
  and displaying their profile/stats comparison in a way that signifies who won.
 */
//Used to store timeout ids to stop if refreshed
let id = []

$('form').submit(() => {
  const usernameLeft = $('form [name=username-left]').val()
  const usernameRight = $('form [name=username-right]').val()

  //Stop animation
  $('.versus').clearQueue()
  $('.left').clearQueue()
  $('.right').clearQueue()
  $('#winner-result').clearQueue()

  //Clear all timeouts
  let length = id.length
  for (var i = 0 ; i < length ; i++) {
    clearTimeout(id.pop()); 
  }

  //Reset all animation attribues
  $('.versus').css("bottom", -500)
  $('.left').css("position", 'relative')
  $('.left').css("right", '1000px')
  $('.right').css("position", 'relative')
  $('.right').css("right", '-1000px')
  $('.left').css("opacity","1")
  $('.right').css("opacity","1")
  $('#winner-result').css("opacity","0")

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

  //Add titles as icon
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
        //ANIMATE!
        $('.left').animate({
          right: '0px'
        }, 500, () => {
            $('.left').animate({
              right: '10px'
            }, 100, () => {
              $('.left').animate({
                right: '0px'
              }, 100)
            })
          })
        $('.right').animate({
          right: '0px'
        }, 500, () => {
            $('.right').animate({
              right: '-10px'
            }, 100, () => {
              $('.right').animate({
                right: '0px'
              }, 100)
            })
          })
        
        //DUELING! for points! :D

        //Actually add points and animate how much points are given
        const addPoints = (which, target, point) => {
          $(`${which} ${target}`).append(`<span class="points">+${point}</span>`)
          $(`${which} ${target} .points`).animate({
            bottom: '+=10px',
            opacity: '0'
          }, 1000, () => {
              $(`${which} ${target} .points`).remove()
            })
          $(`.score-container ${which} .score`).text(Number($(`.score-container ${which} .score`).text()) + point)
        }

        //For all catagories
        const getPoints = (which) => {
          addPoints(which,'.titles',$(`${which} .titles`).children().length * 10)
          id.push(setTimeout(() => {
            addPoints(which,'.total-stars',$(`${which} .total-stars`).text() * 20)
          },1400))
          id.push(setTimeout(() => {
            addPoints(which,'.highest-starred',$(`${which} .highest-starred`).text() * 10)
          },2800))
          id.push(setTimeout(() => {
            addPoints(which,'.public-repos',$(`${which} .public-repos`).text() * 10)
          },4200))
          id.push(setTimeout(() => {
            addPoints(which,'.perfect-repos',$(`${which} .perfect-repos`).text() * 10)
          },5600))
          id.push(setTimeout(() => {
            addPoints(which,'.followers',$(`${which} .followers`).text() * 50)
          },7000))
          id.push(setTimeout(() => {
            addPoints(which,'.following',$(`${which} .following`).text() * 5)
          },8400))
        }
        //Get the scores
        const getLeft = () => {
          getPoints('.left');
          id.push(setTimeout(function() {
            getPoints('.right');
          }, 700))

          //Calculate score results
          id.push(setTimeout(function() {
            console.log("Getting WINNER")
            let pointRight = Number($(`.score-container .right .score`).text())
            let pointLeft = Number($(`.score-container .left .score`).text())
            if(pointLeft > pointRight) {
              $('#winner-result .username').text($('.left .username').text())
              $('.right').animate({
                opacity: '0.5'
              }, 500)
            } else if (pointRight > pointLeft) {
              $('#winner-result .username').text($('.right .username').text())
              $('.left').animate({
                opacity: '0.5'
              }, 500)
            } else { //DRAW
              $('#winner-result .label').text("DRAW")
              $('#winner-result .username').text("")
            }
            $('.versus').animate({
              bottom: '-500px'
            }, 500, () => {
              $('.versus').addClass('hide')
            })
            //Winner animation
            $('#winner-result').removeClass("hide")
            $('#winner-result').animate({
              opacity: 1
            }, 800)

            //Scroll to the winner result
            $('html, body').animate({
                scrollTop: $('#winner-result').offset().top - 100
            }, 500)
          }, 10000))
        }
        //Getting score timeout
        const gettingScore = () => {
          id.push(setTimeout(function() {
            getLeft()
          }, 500));
        }

        //Animate vs image and then call to get scores
        $('.versus').animate({
          bottom: '-100px'
        }, 500, gettingScore)
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
