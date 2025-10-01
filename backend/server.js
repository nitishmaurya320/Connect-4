const express =require('express')
const http=require('http')
const {Server}=require('socket.io')
const port=8000;
const app=express();
const cors=require('cors')
const server=http.createServer(app);
const io=new Server(server,{
    cors:{origin:"*"}
})
const rooms={}
io.on("connection",(socket)=>{
        console.log("user connected",socket.id)
       
        socket.broadcast.emit("welcome","Welcome to the server")
        socket.on("join-room",(name,roomId)=>{
            console.log(roomId)
            socket.join(roomId)
             if (!rooms[roomId]) rooms[roomId] = [4,4,4,4,4,4];
            socket.to(roomId).emit("joined","Someone joined the room");
        })  
        socket.on("message",({name,message,roomId})=>{
             console.log("Message received:", message, "Room:", roomId);
            socket.to(roomId).emit("received-message",{name,message})
        })
        socket.on("make-move",({column,symbol,roomId})=>{
             const row = rooms[roomId][column];
        if (row < 0) return; // column full
        rooms[roomId][column] -= 1;
           io.to(roomId).emit("received-move",column,row,symbol)
        })
})
app.get("/",(req,res)=>{
    res.send("Hello")
})
server.listen(port,()=>{
console.log("Server is running on port",port)
})