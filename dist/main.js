let game = new Game(rows, columns)
const render = new Renderer
let socket = io();
let numPlayers 
let onlinePlayer

socket.on('player-number', function (playerNumber) {
    onlinePlayer = parseInt(playerNumber) + 1
})

const loadPage = function () {
    render.renderBoard(game.matrix)
    if(numPlayers === -1){
        render.renderScore(game, 2)
    }else{
    render.renderScore(game, numPlayers)
    }
    if (game.coinCounter === 0) {
        render.renderEndGame(game.findWinner())
        clearInterval(game.computerMove)
    }
}

$('#start').on('click', async function (e) {
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

    if(numPlayers === -1){
        socket.emit('start' , game);
    }
})

$(document).keydown( function (e) {
    const keyNumbers = {
        1: [40, 38, 39, 37],
        2: [83, 87, 68, 65],
        3: [75, 73, 76, 74],
        4: [66, 71, 78, 86],
    }
    for (let i = 1; i <= numPlayers; i++) {
        if (e.which === keyNumbers[i][0]) {
            game.movePlayer(i, 'down')
        } else if (e.which === keyNumbers[i][1]) {
            game.movePlayer(i, 'up')
        } else if (e.which === keyNumbers[i][2]) {
            game.movePlayer(i, 'right')
        } else if (e.which === keyNumbers[i][3]) {
            game.movePlayer(i, 'left')
        }
        loadPage()
    }

    if(numPlayers === -1){
        if (e.which === 40) {
            game.movePlayer(onlinePlayer, 'down')
           socket.emit('move', onlinePlayer, 'down')
        } else if (e.which === 38) {
            game.movePlayer(onlinePlayer, 'up')
           socket.emit('move', onlinePlayer, 'up')
        } else if (e.which === 39) {
            game.movePlayer(onlinePlayer, 'right')
           socket.emit('move', onlinePlayer, 'right')
        } else if (e.which === 37) {
            game.movePlayer(onlinePlayer, 'left')
           socket.emit('move', onlinePlayer, 'left')
        }
        loadPage()
    }
});

$(function () {

    socket.on('start', function(otherGame){
        game.matrix = otherGame.matrix
        game.coinCounter = otherGame.coinCounter
        game.scorePlayer[1] = 0
        game.scorePlayer[2] = 0
        game.scorePlayer[3] = 0
        game.scorePlayer[4] = 0
        numPlayers = -1
        loadPage()
    });

    socket.on('move', function(playerNum, direction){
        game.movePlayer(playerNum, direction)
        loadPage()
    });
});
