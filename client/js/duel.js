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
  console.log(`examining ${usernameLeft}`)
  console.log(`examining ${usernameRight}`)

  // Fetch data for given user
  //users?username=gaearon&username=qbolt
  // (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  fetch(`${USER_URL}s?username=${usernameLeft}&username=${usernameRight}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(datas => {
      $('#error-left').addClass('hide')
      $('#error-right').addClass('hide')
      $('.left').addClass('hide')
      $('.right').addClass('hide')
      $('.duel-container').removeClass('hide')
        let data = datas[0]
        if(data.status == 200) {
          console.log(`Got data for ${usernameLeft}`)
          console.log(data)
          $('.left .username').text(data.username)
          $('.left .full-name').text(data.name)
          $('.left .location').text(data.location)
          $('.left .email').text(data.email)
          $('.left .bio').text(data.bio)
          $('.left .avatar').attr("src",data.avatar_url)
          $('.left .titles').text(data.titles)
          $('.left .favorite-language').text(data.favorite_language)
          $('.left .total-stars').text(data.total_stars)
          $('.left .most-starred').text(data.highest_starred)
          $('.left .public-repos').text(data.public_repos)
          $('.left .perfect-repos').text(data.perfect_repos)
          $('.left .followers').text(data.followers)
          $('.left .following').text(data.following)
          $('.left').removeClass('hide')
        } else {
          console.log(`Error getting data for ${usernameLeft}`)
          console.log(data["status"])
          $('#error-left').removeClass('hide')
          $('#error-left .error').text(usernameLeft + ' not found')
        }
        return datas[1]
      })
    .then(data => {
        if(data.status == 200) {
          console.log(`Got data for ${usernameRight}`)
          console.log(data)
          $('.right .username').text(data.username)
          $('.right .full-name').text(data.name)
          $('.right .location').text(data.location)
          $('.right .email').text(data.email)
          $('.right .bio').text(data.bio)
          $('.right .avatar').attr("src",data.avatar_url)
          $('.right .titles').text(data.titles)
          $('.right .favorite-language').text(data.favorite_language)
          $('.right .total-stars').text(data.total_stars)
          $('.right .most-starred').text(data.highest_starred)
          $('.right .public-repos').text(data.public_repos)
          $('.right .perfect-repos').text(data.perfect_repos)
          $('.right .followers').text(data.followers)
          $('.right .following').text(data.following)
          $('.right').removeClass('hide')
        } else {
          console.log(`Error getting data for ${usernameRight}`)
          console.log(data["status"])
          $('#error-right').removeClass('hide')
          $('#error-right .error').text(usernameRight + ' not found')
        }
      })
    .then(() => {
      //Duel and stuff
    })
    .catch(err => {
      console.log(`Error getting data for `)
      console.log(err)
      $('.duel-container').addClass('hide')
      $('.duel-error').removeClass('hide')
      $('.error').text(err.response.message)
    })

  return false // return false to prevent default form submission
})
