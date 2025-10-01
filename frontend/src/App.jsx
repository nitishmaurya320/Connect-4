  import React, { useState } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GameChat from './GameChat'
import GameStartPage from './StartPage'
import JoinRoom from './JoinRoom'


  const App = () => {
    const [userName,setUserName]=useState("")
    const [roomId,setRoomId]=useState("")
    
    return (
      
     
      <Routes>
        <Route path='/' element={<GameStartPage/>}/>
        <Route  path='/join-room' element={<JoinRoom setUserName={setUserName} setRoomId={setRoomId}/>}/>
        <Route  path='/game' element={<GameChat name={userName} roomId={roomId}/>}/>
      </Routes>
     
      
    )
  }

  export default App