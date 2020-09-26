const game = new Game(rows, columns)
const render = new Renderer
let numPlayers

const loadPage = function () {
    render.renderBoard(game.matrix)
    render.renderScore(game, numPlayers)
}

const loadAndCheckEnd = function(){
    loadPage()
    if (game.coinCounter === 0) {
        render.renderEndGame(game.findWinner())
        clearInterval(game.computerMove)
    }
}

$('#start').on('click', function () {
    clearInterval(game.computerMove)
    numPlayers = -1
    const rows = $('#rows').val()
    const columns = $('#columns').val()
    if(rows > 1 && columns > 1){
    numPlayers = parseInt($('#num-players').val())
    game.loadBoard(rows, columns, numPlayers)
    game.makeValidBoard()
    loadPage()
    }else{
        render.renderEror()
    }
    if (numPlayers === 1){
        const arrowArray = ['down', 'up', 'right', 'left']
        game.computerMove = setInterval(() => {
            const direction = arrowArray[Math.floor(Math.random()* 4)]
            game.movePlayer(2, direction)
            loadAndCheckEnd()
        }, 200);

    }
})

$(document).keydown(function (e) {
    if (numPlayers > 0) {
        e.which === 40 ? game.movePlayer(1, 'down') :
            e.which === 38 ? game.movePlayer(1, 'up') :
                e.which === 39 ? game.movePlayer(1, 'right') :
                    e.which === 37 ? game.movePlayer(1, 'left') : ''
        loadAndCheckEnd()
    }
    if(numPlayers > 1){
        e.which === 83 ? game.movePlayer(2, 'down') :
            e.which === 87 ? game.movePlayer(2, 'up') :
                e.which === 68 ? game.movePlayer(2, 'right') :
                    e.which === 65 ? game.movePlayer(2, 'left') : ''
        loadAndCheckEnd()
    }
    if(numPlayers > 2){
        e.which === 75 ? game.movePlayer(3, 'down') :
            e.which === 73? game.movePlayer(3, 'up') :
                e.which === 76 ? game.movePlayer(3, 'right') :
                    e.which === 74 ? game.movePlayer(3, 'left') : ''
        loadAndCheckEnd()
    }
    if(numPlayers > 3){
        e.which === 66 ? game.movePlayer(4, 'down') :
            e.which === 71? game.movePlayer(4, 'up') :
                e.which === 78 ? game.movePlayer(4, 'right') :
                    e.which === 86 ? game.movePlayer(4, 'left') : ''
        loadAndCheckEnd()
    }
});


