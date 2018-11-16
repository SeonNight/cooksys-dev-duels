import { Router } from 'express'
import axios from 'axios'
import validate from 'express-validation'
import token from '../../token'

import validation from './validation'
import { url } from 'inspector';

export default () => {
  let router = Router()

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
      .then(languages => languages.reduce((result, cur) => {
          for(var key in cur) {
            if(cur.hasOwnProperty(key)) {
              if(result.hasOwnProperty(key)) {
                result[key] = cur[key] + result[key]
              } else {
                result[key] = cur[key]
              }
            }
          }
          return result;
        },{}))
      .then(languages => {
        if(Object.getOwnPropertyNames(languages).length == 0) {
          return {
            num_lang: 0,
            fav: null
          }
        } else {
          return {
            num_lang: languages.length, //Number of languages
            fav: Object.keys(languages).reduce((a, b) => languages[a] > languages[b] ? a : b) //Favorite language
        }}})
  }

  const getRepoInfo = (url) => {
    return getInfo(url)
      .then(data => getLanguages(data) //Favorite language
        .then(languages => {
          if(data.length == 0) { //If you do nto have any repos
            return {
              total_stars: 0,
              highest_starred: 0,
              perfect_repos: 0,
              num_fork: 0,
              num_repos: 0,
              languages: languages
            }
          } else {
            return {
              total_stars: data.map(k => k.stargazers_count).reduce((total, cur) => total + cur), //total number of stars
              highest_starred: Math.max(...data.map(k => k.stargazers_count)), //the higheest number of stars
              perfect_repos: data.filter(repo => repo.open_issues == 0).length, //Number of repose without open issues
              num_fork: data.map(k => k.fork).reduce((total,cur) => {if(cur) {return total+1} else {return total}},0), //Number forked
              num_repos: data.length, //number of repos
              languages: languages
          }}})) //Languages data
  }

  const getTitles = (data, repoData) => {
    let titles = []
    if(repoData.num_fork/repoData.num_repos > 0.5) { //50% or more repositories are forked
      titles.push(['Forker','More than 50% of user\'s repositories are forked','styles/images/title-fork.png'])
    }

    if(repoData.languages.num_lang == 1) { //100% of repositories use the same language
      titles.push(['One-Trick Pony','One-Trick Pony: 100% of repositories use the same language','styles/images/title-pony.png'])
    } else if (repoData.languages.num_lang > 10) { //Uses more than 10 languages across all repositories
      titles.push(['Jack of all Trades','Jack of all Trades: Use more than 10 languages across all repositories','styles/images/title-jack.png'])
    }

    if(data.following > data.followers * 2) { //The number of people this user is following is at least double the number of followers
      titles.push(['Stalker','Stalker: The number of people this user is following is at least double the number of followers','styles/images/title-stalker.png'])
    } else if (data.followers > data.following * 2) { //The number of followers this user has is at least double the number of following
      titles.push(['Mr. Popular','Mr. Popular: The number of followers this user has is at least double the number of following','styles/images/title-popular.png'])
    }
  
    if(repoData.num_repos == 0) { //Have no public repositories
      titles.push(['Wall Flower','Wall Flower: Has no public repositories','styles/images/title-wallflower.png'])
    }

    if(titles.length == 0) {  //Have no titles
      titles.push(['Titleless','Titleless: Has no titles','styles/images/title-null.png'])
    } else if (titles.length > 3) { //Has more than 3 titles
      titles.push(['Title Collector','Title Collector: Has three ore more titles','styles/images/title-collector.png'])
    }

    return titles
  }

  const getUserInfo = (username) => {
    return axios.get(`http://api.github.com/users/`+username, {
      headers: {
        'Authorization': token
      }
    }).then(response => response.data)
      .then(data => {
        return getRepoInfo(data.repos_url)
          .then(repoData => {
            return {
              status: 200,
              username: data.login,
              name: data.name,
              location: (data.location == null) ? 'No location' : data.location,
              email: (data.email == null) ? 'No email' : data.email,
              bio: (data.bio == null) ? 'No bio' : data.bio,
              avatar_url: data.avatar_url,
              titles: getTitles(data,repoData),
              favorite_language: (repoData.languages.fav == null) ? 'No favorite' : repoData.languages.fav,
              public_repos: data.public_repos,
              total_stars: repoData.total_stars,
              highest_starred: repoData.highest_starred,
              perfect_repos: repoData.perfect_repos,
              followers: data.followers,
              following: data.following}
          })
        })
    .catch(err => {
      return {
        status: err.response.status,
        message: err.response.data.message}
    })
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
        res.json({status: error.response.status, message: error.response.data.message})
      })
  })

  //http://localhost:3000/api/users?username=gaearon&username=qbolt
  /** GET /api/users? - Get users */
  router.get('/users/', validate(validation.users), (req, res) => {
    /*
      TODO
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
