const express = require("express");
const socketIO = require('socket.io');

const app = express();
const server = require('http').Server(app)
const io = socketIO(server)

app.use(express.json())

const rooms = new Map()
 
app.get("/chat/:id", (req, res) => {
    const { id : roomId} = req.params
    const obj = rooms.has(roomId) ? {
      users: [...rooms.get(roomId).get('users').values()],
      messages: [...rooms.get(roomId).get('messages').values()]
    } : {users: [] , messages: []}
    res.json(obj)
});

app.post('/chat', (req, res) => {
    let { roomId, nickname } = req.body
    if(!rooms.has(roomId)){
      rooms.set(roomId, 
        new Map([
          ['users', new Map()],
          ['messages', []]
        ]));
    }
    console.log("Room created "+ roomId)
    res.send()
})

io.on('connection', socket =>{
    socket.on('ROOM:JOIN', ({roomId, nickname}) => {
      socket.join(roomId);
      rooms.get(roomId).get('users').set(socket.id, nickname); // заходим в комнату и сохраняем там пользователя
      const users = [...rooms.get(roomId).get('users').values()]; // получаем список пользователей комнаты
      socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users); // всем пользователям кроме меня отправить запрос
    })

    socket.on('ROOM:NEW-MESSAGE', ({roomId, nickname, text, time}) => {
      const obj = {
        nickname,
        text,
        time
      }
      rooms.get(roomId).get('messages').push(obj)
      socket.to(roomId).emit('ROOM:NEW-MESSAGE', obj);
    })

    socket.on('disconnect', () => {
      rooms.forEach((value, roomId)=>{
        if (value.get('users').delete(socket.id)){
          const users = [...value.get('users').values()]; // получаем список пользователей комнаты
          socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users); // всем пользователям кроме меня отправить запрос
        }
      })
    })
})

server.listen(1223, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log("Fora Chat activated");
});
