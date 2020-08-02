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
  })

  const onJoin = async(user) => {
    dispatch({
      type: 'JOINED',
      payload: user
    })
    socket.emit('ROOM:JOIN', user)
      await fetch (`/chat/${user.roomId}`)
      .then(data=> data.json())
      .then(res => setUsers(res.users))
  }

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users
    })
  }

  const addMessage = (message) =>{
    dispatch({
      type: 'SET_MESSAGES',
      payload: message
    })
  }

  useEffect(()=>{
    socket.on('ROOM:SET_USERS', setUsers)
    socket.on('ROOM:NEW-MESSAGE', addMessage)
  },[])
  
  
  return (
    <StateContext.Provider value={{...state, addMessage, onJoin}}>
      <Router>
          <Route exact path="/login" render={() => <Login/>}/>
          <Route path="/chat/:id" render={() => <Chat />}/>
          <Redirect from='/' to='/login'/>
      </Router>

    </StateContext.Provider>
  );
}

