class Renderer {
    renderBoard(matrix) {
        $('#board-container').empty()
        const coin = '<div class="coin">$</div>'
        const block = '<div class="block"><i class="far fa-hand-paper"></i></div>'
        const player1 = '<div id="player1" class="player"></div>'
        const player2 = '<div id="player2" class="player"></div>'
        const player3 = '<div id="player3" class="player"></div>'
        const player4 = '<div id="player4" class="player"></div>'
        for (let i of matrix) {
            for (let j of i) {
                const content = j === 'c' ? coin : j === 'b' ? block : j === 1 ? player1 : j === 2 ? player2 : j === 3 ? player3 : j === 4 ? player4 : ''
                $('#board-container').append(`<div id="board-cell" style="
                width: ${90 / matrix[0].length}vw; 
                height: ${70 / matrix.length}vh;">${content}</div>`)
            }
        }
        $('#board-container').css('grid-template-rows', `repeat(${matrix.length}, 1fr)`)
        $('#board-container').css('grid-template-columns', `repeat(${matrix[0].length}, 1fr)`)
    }

    renderScore(game, numPlayers) {
        $('#scores').empty()
        if (numPlayers === 1) {
            $('#scores').append(`<div class='score'>Computer: ${game.scorePlayer[2]}</div>`)
        }
        for(let i = 1; i <= numPlayers; i++){
            $('#scores').append(`<div class='score'>Player ${i}: ${game.scorePlayer[i]}</div>`)
        }
    }

    renderEror(){
        $('#board-container').css('grid-template-rows', `1fr`)
        $('#board-container').css('grid-template-columns', `1fr`)
        $('#board-container').empty().append(`<div id='eror-msg'>You must peek a 2x2 board or larger</div>`)
    }

    renderEndGame(winner) {
        if (winner > 0) {
            $('#board-container').append(`<div id='end-game-msg'>Congratulations player ${winner} is the winner!</div>`)
        } else {
            $('#board-container').append(`<div id='end-game-msg'>Its a tie game!</div>`)
        }
    }
}
