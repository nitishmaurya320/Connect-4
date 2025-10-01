import React from 'react'
import { useEffect,useState } from 'react'
import socket from './socket';
const Form = ({name,roomId,chatOpen,setIsChatOpen}) => {
    const [message,setMessage]=useState("");
  
    const [messages,setMessages]=useState([])
useEffect(()=>{
        socket.on("connect",()=>{   
            console.log("connected",socket.id)
        })

        socket.on("welcome",(s)=>{
            console.log(s);
        })
        socket.on("received-message",({name,message})=>{
           
            setMessages((prev)=>[...prev,{name,message}])
        })
        socket.on("joined",(message)=>{
            console.log(message)
        })
        return ()=>{ 
    socket.off("received-message");
  }
        
},[])

const handleSend=(e,message)=>{
e.preventDefault()
    socket.emit("message",{name,message,roomId})
        setMessages((prev)=>[...prev,{name,message}])
      setMessage(""); // clear input

    
}

console.log(messages)
  return (
    <div className={`fixed right-[-100%] border-black border transition-all duration-550  ${chatOpen?"right-[0px]":"right-[-100%]"}`}>
    <div className={`bg-gray-100 p-4   flex flex-col h-[400px]`}>
  {/* Chat messages container */}
  <div className='flex-1 overflow-y-auto  mb-4'>
    {messages.map((m, i) => (
      <div
        key={i}
        className={`w-fit max-w-[70%] flex flex-col px-3 py-1 my-1 rounded-[10px] ${
          m.name === name
            ? "ml-auto bg-green-200 text-black items-end"  // Your messages
            : "mr-auto bg-white text-black items-start"   // Others' messages
        }`}
      >
        <span className='text-xs font-semibold mb-1'>{m.name}</span>
        <span className='text-sm'>{m.message}</span>
      </div>
    ))}
  </div>

  {/* Input form */}
  <form className='flex gap-2' onSubmit={(e) => handleSend(e, message)}>
    <input
      type='text'
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder='Type a message...'
      className='flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400'
    />
    <button
      type='submit'
      className='bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition'
    >
      Send
    </button>
  </form>

  {/* Current user name */}
  <button onClick={()=>{setIsChatOpen(!chatOpen)}}>Close</button>
</div>
</div>

  )
}

export default Form