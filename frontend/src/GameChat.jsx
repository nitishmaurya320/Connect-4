import React, { useState } from 'react'
import Game from './Game'
import Form from './Form'
import { useEffect } from 'react'
import socket from './socket'
const GameChat = ({name,roomId,opponentName,myTurn}) => {
  const [chatOpen,setIsChatOpen]=useState(false)
  const [numChat,setNumChat]=useState(0);
  const [opponentTurn,setOpponentTurn]=useState(!myTurn)
    const [emojis, setEmojis] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [receivedEmoji,setReceivedEmoji]=useState([])
    

const emoji = ["😭", "😂", "😎", "😜", "🤩", "😍"];

const handleClick = (selectedEmoji) => {
  if (isPlaying) return; 
  if(selectedEmoji==="😂"){
      const audio = Math.random()>0.5?new Audio("/laugh1.mp3"):new Audio("/laugh2.mp3")
  if (audio) {
    setIsPlaying(true); // block clicks
    audio.play();

    audio.onended = () => {
      setIsPlaying(false); // allow next click
    };
  }
  }
  
  const id = Date.now();
  const newEmoji = {
    id,
    emoji: selectedEmoji,
  };

  setEmojis((prev) => [...prev, newEmoji]);

  setTimeout(() => {
    setEmojis((prev) => prev.filter((e) => e.id !== id));
  }, 2000);
};


  useEffect(()=>{

  
    setOpponentTurn(!myTurn)
    console.log(opponentTurn)
  },[myTurn])

  useEffect(()=>{
      socket.on("received-emoji",(emo)=>{
        if (isPlaying) return; 
      console.log(emo.emoji)
        if(emo.emoji==="😂"){
      const audio = Math.random()>0.5?new Audio("/laugh1.mp3"):new Audio("/laugh2.mp3")
  if (audio) {
    setIsPlaying(true); // block clicks
    audio.play();

    audio.onended = () => {
      setIsPlaying(false); // allow next click
    };
  }
  }
       setReceivedEmoji(prev => [...prev, emo]);

  setTimeout(() => {
    setReceivedEmoji(prev => prev.filter(e => e.id !== emo.id));
  }, 2000);
    })  
  },[])
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
    <div className=' w-[100%] max-w-[600px] justify-center items-center flex flex-col '>
    <div className='flex justify-center items-center ml-auto'>
       {receivedEmoji.map((emo,id1) => (
        <span
          key={emo.id1}
          className="absolute text-3xl"
          style={{
            // left: `${50 + (Math.random() - 0.5) * 60}%`,
            animation: "flyAndFadeoppo 2s ease-out forwards",
          }}
        >
          {emo.emoji}
        </span>
      ))}
      {
        opponentTurn&&<div className="arrow-container rotate-180 mr-auto  h-[50px] w-[100px] flex justify-center items-center">
  <div class="arrow ">
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>
      }
        <div className="px-5 py-2 text-center text-white font-extrabold text-lg rounded-2xl bg-gradient-to-r from-red-600 via-rose-500 to-red-700 border-2 border-rose-400 shadow-[0_4px_20px_rgba(244,63,94,0.6)]">
  🔥 {opponentName || "Waiting for opponent..."}
</div>

      
    </div>
    
    <Game myTurn={myTurn} id={roomId}/>
 <Form setNumChat={setNumChat}  setIsChatOpen={setIsChatOpen} className="border-amber-200 border-4" chatOpen={chatOpen}  name={name} roomId={roomId} />
 
 <div className='w-full flex'>
      <div className='flex justify-center items-center  mr-auto'>
     <div className="px-5 py-2 text-center text-white font-extrabold text-lg rounded-2xl bg-gradient-to-r from-green-600 via-lime-500 to-green-700 border-2 border-lime-400 shadow-[0_4px_20px_rgba(34,197,94,0.6)]">
  🏆 {name}
</div>


      {
        myTurn&&<div className="arrow-container mr-auto  h-[50px] w-[100px] flex justify-center items-center">
  <div class="arrow ">
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>
      }
  </div>
  <div>
    { emoji.map((emo,i)=>{
      return(
          <button
        onClick={()=>{
          const id = Date.now()
  const newEmoji = { id, emoji: emo }
  handleClick(emo)
  socket.emit("send-emoji", newEmoji,roomId)
        }}
        className='text-4xl'
      >
        {emo}
      </button>
      )
    })
      
    }
     

      {emojis.map((emo,id) => (
        <span
          key={emo.id}
          className="absolute text-3xl"
          style={{
            // left: `${50 + (Math.random() - 0.5) * 60}%`,
            animation: "flyAndFade 2s ease-out forwards",
          }}
        >
          {emo.emoji}
        </span>
      ))}
  </div>
 </div>
  
 

 <div className="relative">
  <button
    onClick={() => {
      setIsChatOpen(!chatOpen);
      setNumChat(0);
    }}
    className={`px-6 py-2 text-white text-lg font-bold rounded-full 
               bg-gradient-to-r from-green-500 via-lime-400 to-green-600 
               border border-lime-300 shadow-[0_0_20px_rgba(132,204,22,0.7)] 
               ${numChat>0?"animate-pulse":""} hover:scale-105 transition-transform duration-300`}
  >
    💬 Chat
  </button>

  {numChat > 0 && (!chatOpen)?
    <div className="absolute -top-2 -right-2 bg-red-500 text-[12px] font-bold 
                    rounded-full w-5 h-5 flex items-center justify-center 
                    text-white shadow-md animate-bounce">
      {numChat}
    </div>:""
  }
</div>

 {/* <div className='relative'>
  <button onClick={()=>{setIsChatOpen(!chatOpen)
    setNumChat(0)
  }} className='bg-green-400   p-2 rounded-[10px] text-[20px]'>Chat</button>
 {
  numChat>0&& <div className='absolute top-0 right-0 bg-red-400 text-[12px] rounded-[50%] w-4 h-4 text-white '> {numChat}</div>
 }
  </div> */}
  </div>
  </div>
  )
}

export default GameChat