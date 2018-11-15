import { Router } from 'express'
import axios from 'axios'
import validate from 'express-validation'
import token from '../../token'

import validation from './validation'
import { url } from 'inspector';

export default () => {
  let router = Router()

  const getUserInfo = (username) => {
    return axios.get(`http://api.github.com/users/`+username, {
      headers: {
        'Authorization': token
      }
    }).then(response => response.data)
      .then(data => {return {
        username: data.login,
        name: data.name,
        location: data.location,
        email: data.email,
        bio: data.bio,
        avatar_url: data.avatar_url,
        titles: ['test title'],
        favorite_language: "Favorite language",
        public_repos: data.public_repos,
        total_stars: "Total number of stars",
        highest_starred: 'what is your highest star count',
        perfect_repos: 'number of perfect repos',
        followers: data.followers,
        following: data.following
      }})
  }


  /** GET /health-check - Check service health */
  router.get('/health-check', (req, res) => res.send('OK'))

  // The following is an example request.response using axios and the
  // express res.json() function
  /** GET /api/rate_limit - Get github rate limit for your token */
  router.get('/rate', (req, res) => {
    axios.get(`http://api.github.com/rate_limit`, {
      headers: {
        'Authorization': token
      }
    }).then(({ data }) => res.json(data))
  })

  /** GET /api/user/:username - Get user */
  router.get('/user/:username', validate(validation.user), (req, res) => {
    /*
      TODO
      Fetch data for user specified in path variable
      parse/map data to appropriate structure and return as JSON object
    */
    getUserInfo(req.params.username)
      .then(data => res.json(data))
      .catch(error => {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
          console.log(error.response.headers);
        }
      })
  })

  //http://localhost:3000/api/users?username=gaearon&username=qbolt
  /** GET /api/users? - Get users */
  router.get('/users/', validate(validation.users), (req, res) => {
    console.log(req.query)
    /*
      TODO
      Fetch data for users specified in query
      parse/map data to appropriate structure and return as a JSON array
    */
   Promise.all(req.query.username.map(username => getUserInfo(username)))
    .then(data => res.json(data))
    .catch(error => {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        console.log(error.response.headers);
      }
    })
  })

  return router
}
