import React, { useState } from 'react'
import Game from './Game'
import Form from './Form'
const GameChat = ({name,roomId}) => {
  const [chatOpen,setIsChatOpen]=useState(false)
  return (
    <div className='flex flex-col justify-center items-center px-1'
  style={{
    backgroundImage: `url('/assets/23828.jpg')`,
    width: '100%',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
  ><Game id={roomId}/>
 <Form setIsChatOpen={setIsChatOpen} className="border-amber-200 border-4" chatOpen={chatOpen}  name={name} roomId={roomId} />
 <button onClick={()=>{setIsChatOpen(!chatOpen)}} className='bg-green-400 p-2 rounded-[10px] text-[20px]'>Chat</button>
  </div>
  )
}

export default GameChat