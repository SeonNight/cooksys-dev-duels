export const languagesReduce = (languages) => {
    return languages.reduce((result, cur) => {
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
        },{})
}

export const languagesParse = (languages) => {
    if(Object.getOwnPropertyNames(languages).length == 0) {
        return {
            num_lang: 0,
            fav: null
        }
    } else {
        return {
            num_lang: languages.length, //Number of languages
            fav: Object.keys(languages).reduce((a, b) => languages[a] > languages[b] ? a : b) //Favorite language
    }}
}

export const repoInfoParse = (data, languages) => {
    if(data.length == 0) { //If you do not have any repos
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
        }}
}

//Set titles and it's info
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

export const userInfoParse = (data, repoData) => {
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
            following: data.following
        }
}