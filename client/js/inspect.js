/* eslint-disable no-undef */
$('form').submit(() => {
  const username = $('form input').val()
  $('.user-error').addClass('hide')
  $('.user-results').addClass('hide')
  //Put loading message
  $('.loading').removeClass('hide')
  if(username == "") {
    $('.loading').addClass('hide')
    $('.user-error').removeClass('hide')
    $('.error').text('Please Input Username')
    return false;
  }

  const addTitles = (titles) => {
    $('.titles').text("")
    titles.forEach((titleInfo) => {
      $('.titles').append(`<span class="tooltip"><img src="${titleInfo[2]}" alt="${titleInfo[0]}"/>
        <span class="tooltiptext">${titleInfo[1]}</span></span>`)
    })
  }

  // Fetch data for given user
  fetch(`${USER_URL}/${username}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(data => {
      //Remove loading message
      $('.loading').addClass('hide')
      if(data["status"] == 200) {
        $('.username').text(data.username)
        $('.full-name').text(data.name)
        $('.location').text(data.location)
        $('.email').text(data.email)
        $('.bio').text(data.bio)
        $('.avatar').attr("src",data.avatar_url)
        addTitles(data.titles)
        $('.favorite-language').text(data.favorite_language)
        $('.total-stars').text(data.total_stars)
        $('.most-starred').text(data.highest_starred)
        $('.public-repos').text(data.public_repos)
        $('.perfect-repos').text(data.perfect_repos)
        $('.followers').text(data.followers)
        $('.following').text(data.following)
        //Display and hide
        $('.user-results').removeClass('hide')
        $('.user-error').addClass('hide')
        //Scroll to container
        $('html, body').animate({
            scrollTop: $('.user-results').offset().top
        }, 500);
      } else {
        $('.user-results').addClass('hide')
        $('.user-error').removeClass('hide')
        $('.error').text(username + ' not found')
      }
    })
    .catch(err => {
      console.log(err)
      $('.user-results').addClass('hide')
      $('.user-error').removeClass('hide')
      $('.error').text('ERROR')
    })

  return false // return false to prevent default form submission
})
