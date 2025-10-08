  import React, { useState } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GameChat from './GameChat'
import GameStartPage from './StartPage'
import JoinRoom from './JoinRoom'


  const App = () => {
    const [userName,setUserName]=useState("")
    const [roomId,setRoomId]=useState("")
     const [opponentName,setOpponentName]=useState("")
      const [myTurn,setMyTurn]=useState(false);
    return (
      
     
      <Routes>
        <Route path='/' element={<GameStartPage/>}/>
        <Route  path='/join-room' element={<JoinRoom setOpponentName={setOpponentName} setMyTurn={setMyTurn} setUserName={setUserName} setRoomId={setRoomId}/>}/>
        <Route   path='/game' element={<GameChat myTurn={myTurn} name={userName} opponentName={opponentName} roomId={roomId}/>}/>
      </Routes>
     
      
    )
  }

  export default App