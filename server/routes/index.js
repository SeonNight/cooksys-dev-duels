import { Router } from 'express'
import axios from 'axios'
import validate from 'express-validation'
import token from '../../token'

import validation from './validation'
import { url } from 'inspector';

import {languagesReduce, languagesParse, repoInfoParse, userInfoParse} from './lib'


//Using Axios
const getInfo = (url) => {
  return axios.get(url, {
      headers: {
          'Authorization': token
      }
  }).then(response => response.data)
}

//Get data for languages
const getLanguages = (data) => {
  return Promise.all(data.map(repo => getInfo(repo.languages_url)))
      .then(languages => languagesReduce(languages))
      .then(languages => languagesParse(languages))
}

//Get repo info
const getRepoInfo = (url) => {
    return getInfo(url)
        .then(data => getLanguages(data) //Favorite language
            .then(languages => repoInfoParse(data,languages))) //Languages data
}

//Get user informatin from AXIOS
const getUserInfo = (username) => {
  return getInfo(`http://api.github.com/users/`+username)
  .then(data => {
      //Get repo data
      return getRepoInfo(data.repos_url)
        //Put data into a nice readable file
        .then(repoData => userInfoParse(data,repoData))
      })
    .catch(err => {
        console.log("Error")
        console.log(err.response.status)
        return {
            status: err.response.status,
            message: err.response.data.message}
    })
}

export default () => {
  let router = Router()

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
      Fetch data for user specified in path variable
      parse/map data to appropriate structure and return as JSON object
    */
    getUserInfo(req.params.username)
      .then(data => res.json(data))
      .catch(error => {
        res.json({status: error.response.status, message: error.response.data.message})
      })
  })

  //http://localhost:3000/api/users?username=gaearon&username=qbolt
  /** GET /api/users? - Get users */
  router.get('/users/', validate(validation.users), (req, res) => {
    /*
      Fetch data for users specified in query
      parse/map data to appropriate structure and return as a JSON array
    */
   Promise.all(req.query.username.map(username => getUserInfo(username)))
    .then(data => res.json(data))
    .catch(error => {
      res.json({status: error.response.status, message: error.response.data.message})
    })
  })

  return router
}
