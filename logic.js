class Game {
    constructor() {
        this.matrix = []
        this.scorePlayer = {}
        this.scorePlayer[1] = 0
        this.scorePlayer[2] = 0
        this.scorePlayer[3] = 0
        this.scorePlayer[4] = 0
        this.coinCounter = 0
        //this.computerLocatinos = {}
    }

    print() {
        for (let r of this.matrix) {
            let row = ''
            for (let c of r) {
                row += "\t" + c
            }
            console.log(row);
        }
    }

    alter(rowNum, colNum, num) {
        this.matrix[rowNum][colNum] = num
    }

    get(rowNum, colNum) {
        return this.matrix[rowNum][colNum]
    }

    getColumn(colNum) {
        const column = []
        for (let i = 0; i < this.matrix.length; i++) {
            column.push(this.matrix[i][colNum])
        }
        return column
    }

    getRow(rowNum) {
        const row = []
        for (let i of this.matrix[rowNum]) {
            row.push(i);
        }
        return row
    }

    findCoordinate(value) {
        for (let rowNum in this.matrix) {
            for (let colNum in this.matrix[rowNum]) {
                if (this.matrix[rowNum][colNum] === value) {
                    return { x: colNum, y: rowNum }
                }
            }
        }
    }

    loadBoard(rowNum, colNum, numPlayers) {
        const newBoard = []
        this.coinCounter = 0
        this.scorePlayer[1] = 0
        this.scorePlayer[2] = 0
        this.scorePlayer[3] = 0
        this.scorePlayer[4] = 0
        for (let i = 0; i < rowNum; i++) {
            let row = []
            for (let j = 0; j < colNum; j++) {
                const randNum = Math.random()
                if (randNum < 0.3) {
                    row.push('c')
                    this.coinCounter++
                } else {
                    if(randNum < 0.55){
                        row.push('b')
                    } else{
                         row.push('.')
                        }
                }
            }
            newBoard.push(row)
        }
        if (newBoard[0][0] === 'c') {
            this.coinCounter--
        }
        if (newBoard[rowNum - 1][colNum - 1] === 'c') {
            this.coinCounter--
        }
        newBoard[rowNum - 1][colNum - 1] = 1
        newBoard[0][0] = 2
        if(numPlayers > 2){
            newBoard[0][colNum - 1] === 'c' ? this.coinCounter-- : null
            newBoard[0][colNum - 1] = 3
            if(numPlayers > 3) {
                newBoard[rowNum - 1][0] === 'c' ? this.coinCounter-- : null
                newBoard[rowNum - 1][0] = 4           
            }
        }
        this.matrix = newBoard
    }

    movePlayer(playerNum, direction) {
        let { x, y } = this.findCoordinate(playerNum)
        const i = y
        const j = x
        direction === 'left' ? x-- : direction === 'right' ? x++ : direction === 'down' ? y++ : y--
        if ((this.matrix[y] && this.matrix[y][x]) && (this.matrix[y][x] === '.' || this.matrix[y][x] === 'c')) {
            if (this.matrix[y][x] === 'c') {
                this.scorePlayer[playerNum] += 10 
                this.coinCounter--
            }
            this.alter(i, j, '.')
            this.alter(y, x, playerNum)
        }
    }

    // moveCompuetr() {
    //     let { x, y } = this.findCoordinate(2)
    //     x = parseInt(x)
    //     y = parseInt(y)
    //     console.log(x,y);
    //     if(this.computerLocatinos[y] !== undefined && this.computerLocatinos[y][x] !== undefined){
    //         this.computerLocatinos[y][x]++
    //     }else{
    //         this.computerLocatinos[y] = this.computerLocatinos[y] ? {[x]: 1} : {[x]: 1}
    //     }
    //     console.log(this.computerLocatinos);
    //     const i = y
    //     const j = x
    //     if ((this.matrix[y][x+1]) && (this.matrix[y][x+1] === '.' || this.matrix[y][x+1] === 'c') && (!this.computerLocatinos[y] || !this.computerLocatinos[y][x+1] || this.computerLocatinos[y][x+1] < 3)) {
    //         x++
    //     }else if ((this.matrix[y+1] && this.matrix[y+1][x]) && (this.matrix[y+1][x] === '.' || this.matrix[y+1][x] === 'c') && (!this.computerLocatinos[y+1] || !this.computerLocatinos[y+1][x] || this.computerLocatinos[y+1][x] < 3)) {
    //         y++
    //     }else if ((this.matrix[y][x-1]) && (this.matrix[y][x-1] === '.' || this.matrix[y][x-1] === 'c') && (!this.computerLocatinos[y] || !this.computerLocatinos[y][x-1] || this.computerLocatinos[y][x-1] < 3)) {
    //         x--
    //     }else if ((this.matrix[y-1] && this.matrix[y-1][x]) && (this.matrix[y-1][x] === '.' || this.matrix[y-1][x] === 'c') && (!this.computerLocatinos[y-1] || !this.computerLocatinos[y-1][x] || this.computerLocatinos[y-1][x] < 3)) {
    //         y--
    //     }
    //     if (this.matrix[y][x] === 'c') {
    //         this.scorePlayer2 += 10
    //         this.coinCounter--
    //     }
    //     this.alter(i, j, '.')
    //     this.alter(y, x, 2)
    // }

    makeValidBoard() {
        const blockArray = []
        const blockMatrix = []
        let pushed = false
        for (let y in this.matrix) {
            for (let x in this.matrix[y]) {
                if (this.matrix[y][x] === 'b') {
                    blockArray.push({ x: parseInt(x), y: parseInt(y) })
                }
            }
        }

        for (let n of blockArray) {
            for( let b in blockMatrix){
                if (blockMatrix[b].some(num => Math.abs(num.x - n.x) < 2 && Math.abs(num.y - n.y) < 2)) {
                    if(!pushed){
                        blockMatrix[b].push({ x: n.x, y: n.y })
                        pushed = true
                    }else{
                        const removed = blockMatrix.splice(b, 1)[0]
                        let arrayToPush
                        removed.forEach(r=>{
                            if(!arrayToPush){
                                arrayToPush = blockMatrix.find(b => b.some(o => Math.abs(o.x - r.x) < 2 && Math.abs(o.y - r.y) < 2))
                            }
                    })
                        arrayToPush.push(...removed)
                    }
                } 
            }
            if(!pushed){
                blockMatrix.push([{ x: n.x, y: n.y }])
            }
            pushed = false
        }
        
        let count = 0
        for(let m of blockMatrix){
            for(let n in m){
                if(m[n].x === 0 || m[n].y === 0 || m[n].x === this.matrix[0].length-1 || m[n].y === this.matrix.length-1){
                    count++
                    count > 1 ? this.matrix[m[n].y][m[n].x] = '.' : null
                }
                if(n > 2){
                    this.matrix[m[n].y][m[n].x] = '.'
                }
            }
            count = 0
        }
        return blockMatrix
    }

    findWinner(){
        let biggest = 1
        let tied
        for (let i = 2; i < 5; i++) {
            if (this.scorePlayer[i] === this.scorePlayer[biggest] && this.scorePlayer[i] > 0) {
                tied = biggest
            }
            if (this.scorePlayer[i] > this.scorePlayer[biggest]) {
                biggest = i
            }
        }
        if (!tied || tied !== biggest) {
            return biggest
        } else {
            return -1
        }
    }

}

