class Game {
    constructor() {
        this.matrix = []
        this.scorePlayer = {}
        this.scorePlayer[1] = 0
        this.scorePlayer[2] = 0
        this.scorePlayer[3] = 0
        this.scorePlayer[4] = 0
        this.coinCounter = 0
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
        if (this.matrix[rowNum] && this.matrix[rowNum][colNum]) {
            return this.matrix[rowNum][colNum]
        } else {
            return 0
        }
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
                if (j === colNum - 1 && i === rowNum - 1) {
                    row.push(1)
                } else if (j === 0 && i === 0) {
                    row.push(2)
                } else if (numPlayers > 2 && i === 0 && j === colNum - 1) {
                    row.push(3)
                } else if (numPlayers > 3 && i === rowNum - 1 && j === 0) {
                    row.push(4)
                } else {
                    const randNum = Math.random()
                    if (randNum < 0.3) {
                        row.push('c')
                        this.coinCounter++
                    } else {
                        if (randNum < 0.55) {
                            row.push('b')
                        } else {
                            row.push('.')
                        }
                    }
                }
            }
            newBoard.push(row)
        }
        this.matrix = newBoard
    }

    movePlayer(playerNum, direction) {
        let { x, y } = this.findCoordinate(playerNum)
        const i = y
        const j = x
        direction === 'left' ? x-- : direction === 'right' ? x++ : direction === 'down' ? y++ : y--
        const wantedPosition = this.get(y, x)
        if ((wantedPosition) && (wantedPosition === '.' || wantedPosition === 'c')) {
            if (wantedPosition === 'c') {
                this.scorePlayer[playerNum] += 10
                this.coinCounter--
            }
            this.alter(i, j, '.')
            this.alter(y, x, playerNum)
        }
    }

    getBlocksLocations() {
        const blockArray = []
        for (let y in this.matrix) {
            for (let x in this.matrix[y]) {
                if (this.get(y, x) === 'b') {
                    blockArray.push({ x: parseInt(x), y: parseInt(y) })
                }
            }
        }
        return blockArray
    }

    divideBlocksLocations(blockArray) {
        const blockMatrix = []
        let pushed = false
        for (let n of blockArray) {
            for (let b in blockMatrix) {
                if (blockMatrix[b].some(num => Math.abs(num.x - n.x) < 2 && Math.abs(num.y - n.y) < 2)) {
                    if (!pushed) {
                        blockMatrix[b].push({ x: n.x, y: n.y })
                        pushed = true
                    } else {
                        const removed = blockMatrix.splice(b, 1)[0]
                        let arrayToPush
                        removed.forEach(r => {
                            if (!arrayToPush) {
                                arrayToPush = blockMatrix.find(b => b.some(o => Math.abs(o.x - r.x) < 2 && Math.abs(o.y - r.y) < 2))
                            }
                        })
                        arrayToPush.push(...removed)
                    }
                }
            }
            if (!pushed) {
                blockMatrix.push([{ x: n.x, y: n.y }])
            }
            pushed = false
        }
        return blockMatrix
    }

    makeValidBoard() {
        const blockArray = this.getBlocksLocations()
        const blockMatrix = this.divideBlocksLocations(blockArray)
        let countBlocksIngroup = 0
        let countTouchBorder = 0
        for (let m of blockMatrix) {
            for (let n of m) {
                countBlocksIngroup++
                if (n.x === 0 || n.y === 0 || n.x === this.matrix[0].length - 1 || n.y === this.matrix.length - 1) {
                    countTouchBorder++
                    countTouchBorder > 1 ? this.alter(n.y, n.x, '.') : null
                }
                if (countBlocksIngroup > 3) {
                    this.alter(n.y, n.x, '.')
                }
            }
            countBlocksIngroup = 0
            countTouchBorder = 0
        }
    }

    findWinner() {
        let biggest = 1
        let tied = 0
        for (let i = 2; i < 5; i++) {
            if (this.scorePlayer[i] === this.scorePlayer[biggest]) {
                tied = biggest
            } else if (this.scorePlayer[i] > this.scorePlayer[biggest]) {
                biggest = i
            }
        }
        if (tied !== biggest) {
            return biggest
        } else {
            return -1
        }
    }

    moveCompuetr() {
        let { x, y } = this.findCoordinate(2)
        x = parseInt(x)
        y = parseInt(y)
        let optionalDirections = []
        if (this.get(y, x + 1) === 'c') {
            this.movePlayer(2, 'right')
            return
        }
        if (this.get(y, x - 1) === 'c') {
            this.movePlayer(2, 'left')
            return
        }
        if (this.get(y - 1, x) === 'c') {
            this.movePlayer(2, 'up')
            return
        }
        if (this.get(y + 1, x) === 'c') {
            this.movePlayer(2, 'down')
            return
        }
        if (this.get(y, x + 1) === '.') {
            optionalDirections.push('right')
        }
        if (this.get(y, x - 1) === '.') {
            optionalDirections.push('left')
        }
        if (this.get(y - 1, x) === '.') {
            optionalDirections.push('up')
        }
        if (this.get(y + 1, x) === '.') {
            optionalDirections.push('down')
        }
        const randomLocation = Math.floor(Math.random() * optionalDirections.length)
        const direction = optionalDirections[randomLocation]
        this.movePlayer(2, direction)
    }

}

