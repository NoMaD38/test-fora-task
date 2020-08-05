const express = require("express");
const socketIO = require('socket.io');

const app = express();
const server = require('http').Server(app)
const io = socketIO(server)

app.use(express.json())

const rooms = new Map()

// Отправляем информацию о комнате пользователю
app.get("/chat/:id", (req, res) => {
    const { id : roomId} = req.params
    const obj = rooms.has(roomId) ? {
      users: [...rooms.get(roomId).get('users').values()],
      messages: [...rooms.get(roomId).get('messages').values()],
      rooms_names: [...rooms.keys()],
    } : {users: [] , messages: [], rooms_names: []}
    res.json(obj)
});

// Создаём новую комнату, если такой не существует
app.post('/chat', (req, res) => {
    let { roomId, nickname } = req.body
    if(!rooms.has(roomId)){
      rooms.set(
        roomId, 
        new Map([
          ['users', new Map()],
          ['messages', []]
        ]));
    }
    console.log("Room created "+ roomId)
    res.send()
})

io.on('connection', socket =>{
    // обработчик на вход
    socket.on('ROOM:JOIN', ({roomId, nickname}) => {
      socket.join(roomId); // Сокет подключает к комнате
      rooms.get(roomId).get('users').set(socket.id, nickname); // Сохраняем там пользователя
      const users = [...rooms.get(roomId).get('users').values()]; // Получаем список пользователей комнаты
      const rooms_names = [...rooms.keys()]; // Получаем список комнат
      socket.broadcast.emit('ROOM:SET_ROOMS', rooms_names); // Отправляем пользователям комнаты список комнат
      socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users); // Отправляем пользователям комнаты список пользователей
    })

    // обработчик на смену комнаты
    socket.on('ROOM:REJOIN', ({roomId, nickname, oldRoomId}) => {
      rooms.get(oldRoomId).get('users').delete(socket.id) // Удаляем пользователя из предыдущей комнаты
      socket.leave(oldRoomId); // Сокет отключает от комнаты
      const newUsers = [...rooms.get(oldRoomId).get('users').values()]; // получаем список пользователей старой комнаты
      socket.to(oldRoomId).broadcast.emit('ROOM:SET_USERS', newUsers); // Отправляем новый список пользователей старой комнате

      socket.join(roomId); // Сокет подключает к комнате
      rooms.get(roomId).get('users').set(socket.id, nickname); // Сохраняем там пользователя
      const users = [...rooms.get(roomId).get('users').values()]; // Получаем список пользователей комнаты
      socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users); // Отправляем пользователям комнаты список пользователей (кроме меня)
      console.log(rooms);
    })

    // обработчик на добавление нового сообщения
    socket.on('ROOM:NEW-MESSAGE', ({roomId, nickname, text, time}) => {
      const obj = {
        nickname,
        text,
        time
      }
      rooms.get(roomId).get('messages').push(obj); // Добавляем новое сообщение
      socket.to(roomId).emit('ROOM:NEW-MESSAGE', obj); //Отправляем сообщение пользователям
    })

    // обработчик на отсоединение пользователя
    socket.on('disconnect', () => {
      rooms.forEach((value, roomId)=>{
        // Удаляем пользователя из комнаты и сообщаем пользователям
        if (value.get('users').delete(socket.id)){
          const users = [...value.get('users').values()]; 
          socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
        }
        // Удаляем пустую комнату
        if(value.get('users').size == 0){
          socket.leave(roomId);
          rooms.delete(roomId);
          const rooms_names = [...rooms.keys()];
          socket.broadcast.emit('ROOM:SET_ROOMS', rooms_names);
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
