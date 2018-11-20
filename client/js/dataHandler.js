//Add titles as icon
const addTitles = (titles, which="") => {
        $(`${which} .titles`).text("")
        titles.forEach((titleInfo) => {
                $(`${which} .titles`).append(`<span class="tooltip"><img src="${titleInfo[2]}" alt="${titleInfo[0]}"/>
                <span class="tooltiptext">${titleInfo[1]}</span></span>`)
        })
}

const setData = (data, which = "") => {
        $(`${which} .username`).text(data.username)
        $(`${which} .full-name`).text(data.name)
        $(`${which} .location`).text(data.location)
        $(`${which} .email`).text(data.email)
        $(`${which} .bio`).text(data.bio)
        $(`${which} .avatar`).attr("src",data.avatar_url)
        addTitles(data.titles, which)
        $(`${which} .favorite-language`).text(data.favorite_language)
        $(`${which} .total-stars`).text(data.total_stars)
        $(`${which} .most-starred`).text(data.highest_starred)
        $(`${which} .public-repos`).text(data.public_repos)
        $(`${which} .perfect-repos`).text(data.perfect_repos)
        $(`${which} .followers`).text(data.followers)
        $(`${which} .following`).text(data.following)
}