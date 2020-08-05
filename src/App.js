import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom'

import { Login }  from './pages/Login'
import { Chat }  from './pages/Chat'
import rootReducer from "./rootReducer"
import StateContext from "./rootContext"
import socket from './socket'

export const App = () => {

  const [state, dispatch] = React.useReducer(rootReducer, {
    joined: false,
    roomId: null,
    nickname: null,
    users: [],
    messages: [],
    rooms:[]
  });

  const onJoin = async(user) => {
    dispatch({type: 'JOINED', payload: user})
    socket.emit('ROOM:JOIN', user)
      await fetch (`/chat/${user.roomId}`)
      .then(data=> data.json())
      .then(res => {
        setUsers(res.users)
        setMessages(res.messages)
        setRooms(res.rooms_names)
      })
  };

  const onReJoin = async (data) => {
    dispatch({
      type: 'REJOINED',
      payload: data
    })
    socket.emit('ROOM:REJOIN', data)
      await fetch (`/chat/${data.roomId}`)
      .then(response=> response.json())
      .then(res => {
        setUsers(res.users)
        setMessages(res.messages)
        setRooms(res.rooms_names)
      })
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users
    })
  };

  const setRooms = (rooms) =>{
    dispatch({
      type: 'SET_ROOMS',
      payload: rooms
    })
  };
  
  const setMessages = (messages) =>{
    dispatch({
      type: 'SET_MESSAGES',
      payload: messages
    })
  };


  const addMessage = (message) =>{
    dispatch({
      type: 'ADD_MESSAGE',
      payload: message
    })
  };

  useEffect(()=>{
    // Слушатели событий на добавление пользователей, комнат и сообщений
    socket.on('ROOM:SET_USERS', setUsers)
    socket.on('ROOM:SET_ROOMS', setRooms)
    socket.on('ROOM:NEW-MESSAGE', addMessage)
  },[])
  
  return (
    <StateContext.Provider value={{...state, addMessage, onJoin, onReJoin}}>
      <Router>
          <Route exact path="/login" component={Login}/>
          <Route path="/chat/:roomId" component={Chat}/>
          <Redirect from='/' to='/login'/>
      </Router>
    </StateContext.Provider>
  );
}

