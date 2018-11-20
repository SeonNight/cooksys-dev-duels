//Used to store timeout ids to stop if refreshed
let id = []

const resetAnimations = () => {
    //Stop animations
    $('.versus').clearQueue()
    $('.left').clearQueue()
    $('.right').clearQueue()
    $('#winner-result').clearQueue()

    //Reset all animation attribues
    $('.versus').css("bottom", -500)
    $('.left').css("position", 'relative')
    $('.left').css("right", '1000px')
    $('.right').css("position", 'relative')
    $('.right').css("right", '-1000px')
    $('.left').css("opacity","1")
    $('.right').css("opacity","1")
    $('#winner-result').css("opacity","0")
}

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
        addPoints(which,'.most-starred',$(`${which} .most-starred`).text() * 10)
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
const getLeftRightPoints = () => {
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
        getLeftRightPoints()
        }, 500));
}

//DUEL
const duel = () => {
//ANIMATE! left right card
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
//Animate vs image and then call to get scores
$('.versus').animate({
    bottom: '-100px'
    }, 500, gettingScore())
}