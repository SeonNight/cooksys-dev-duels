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

  // Fetch data for given user
  fetch(`${USER_URL}/${username}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(data => {
      //Remove loading message
      $('.loading').addClass('hide')
      if(data["status"] == 200) {
        setData(data)
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
