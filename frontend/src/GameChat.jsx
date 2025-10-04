import React, { useState } from 'react'
import Game from './Game'
import Form from './Form'
const GameChat = ({name,roomId,opponentName}) => {
  const [chatOpen,setIsChatOpen]=useState(false)
  // const [waitingMessage,setWaitingMessage]=useState("")
 
  // console.log(waitingMessage)
  return (
    <div className='flex flex-col justify-center items-center px-1'
  style={{
    backgroundImage: `url('/assets/23828.jpg')`,
    width: '100%',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
  >
    <div className='border w-[100%] max-w-[600px] justify-center items-center flex flex-col'>
    <div className="ml-auto bg-red-500 px-2 rounded-[10px] text-center py-1 text-sm font-semibold border-b">
        {opponentName || "Waiting for opponent..."}
      </div>
    <Game id={roomId}/>
 <Form  setIsChatOpen={setIsChatOpen} className="border-amber-200 border-4" chatOpen={chatOpen}  name={name} roomId={roomId} />
 <div className="mr-auto bg-green-500 px-2 rounded-[10px] text-center py-1 text-sm font-semibold border-b">
        {name}
      </div>
 <button onClick={()=>{setIsChatOpen(!chatOpen)}} className='bg-green-400 p-2 rounded-[10px] text-[20px]'>Chat</button>
  </div>
  </div>
  )
}

export default GameChat