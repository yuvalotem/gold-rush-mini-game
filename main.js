const game = new Game(rows, columns)
const render = new Renderer
let numPlayers

const loadPage = function () {
    render.renderBoard(game.matrix)
    render.renderScore(game, numPlayers)
    if (game.coinCounter === 0) {
        render.renderEndGame(game.findWinner())
        clearInterval(game.computerMove)
    }
}

$('#start').on('click', function () {
    clearInterval(game.computerMove)
    numPlayers = 0
    const rows = $('#rows').val()
    const columns = $('#columns').val()

    if (rows > 1 && columns > 1) {
        numPlayers = parseInt($('#num-players').val())
        game.loadBoard(rows, columns, numPlayers)
        game.makeValidBoard()
        loadPage()
    } else {
        render.renderEror()
    }

    if (numPlayers === 1) {
        game.computerMove = setInterval(() => {
            game.moveCompuetr()
            loadPage()
        }, 180);

    }
})

$(document).keydown(function (e) {
    const keyNumbers = {
        1: [40, 38, 39, 37],
        2: [83, 87, 68, 65],
        3: [75, 73, 76, 74],
        4: [66, 71, 78, 86],
    }
    for (let i = 1; i <= numPlayers; i++) {
        e.which === keyNumbers[i][0] ? game.movePlayer(i, 'down') :
            e.which === keyNumbers[i][1] ? game.movePlayer(i, 'up') :
                e.which === keyNumbers[i][2] ? game.movePlayer(i, 'right') :
                    e.which === keyNumbers[i][3] ? game.movePlayer(i, 'left') : null
        loadPage()
    }
});


