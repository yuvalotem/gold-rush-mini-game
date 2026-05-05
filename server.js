const express = require('express')
const path = require('path')

const app = express();
const http = require('http').createServer(app);
const socketIO = require('socket.io');

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))

const server = app.listen(3000, (req, res) => {
  console.log('listening on *:3000');
});

const io = socketIO(server)
const connections = [null, null];

io.on('connection', (socket) => {

  let playerIndex = -1;
  for (var i in connections) {
    if (connections[i] === null) {
      playerIndex = i;
    }
  }
  if (playerIndex == -1) return;
  connections[playerIndex] = socket;
  socket.emit('player-number', playerIndex);

  socket.on('start', (game) => {
    socket.broadcast.emit('start', game);
  })

  socket.on('move', (playerNum, direction) => {
    socket.broadcast.emit('move', playerNum, direction);
  });

  socket.on('disconnect', function() {
    console.log(`Player ${playerIndex} Disconnected`);
    connections[playerIndex] = null;
  });
})

