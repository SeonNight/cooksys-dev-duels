/* eslint-disable no-undef */
$('form').submit(() => {
  const username = $('form input').val()
  console.log(`examining ${username}`)

  // Fetch data for given user
  // (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  fetch(`${USER_URL}/${username}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(data => {
      if(data["status"] == 200) {
        console.log(`Got data for ${username}`)
        console.log(data)
        $('.username').text(data.username)
        $('.full-name').text(data.name)
        $('.location').text(data.location)
        $('.email').text(data.email)
        $('.bio').text(data.bio)
        $('.avatar').attr("src",data.avatar_url)
        $('.titles').text(data.titles)
        $('.favorite-language').text(data.favorite_language)
        $('.total-stars').text(data.total_stars)
        $('.most-starred').text(data.highest_starred)
        $('.public-repos').text(data.public_repos)
        $('.perfect-repos').text(data.perfect_repos)
        $('.followers').text(data.followers)
        $('.following').text(data.following)
        $('.user-results').removeClass('hide') // Display '.user-results' element
        $('.user-error').addClass('hide')
      } else {
        console.log(`Error getting data for ${username}`)
        console.log(data.status)
        $('.user-results').addClass('hide')
        $('.user-error').removeClass('hide')
        $('.error').text(data.username + ' not found')
      }
    })
    .catch(err => {
      console.log(`Error getting data for ${username}`)
      console.log(err)
      $('.user-results').addClass('hide')
      $('.user-error').removeClass('hide')
      $('.error').text(err.response.message)
    })

  return false // return false to prevent default form submission
})
