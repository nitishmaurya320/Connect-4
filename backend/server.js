const express =require('express')
require('dotenv').config();
const http=require('http')
const {Server}=require('socket.io')
const PORT = process.env.PORT || 8000;
const app=express();
const cors=require('cors')
const server=http.createServer(app);
const io=new Server(server,{
    cors: {
        origin: ["https://connect-4-9kay.vercel.app"], // your frontend
        methods: ["GET", "POST"],
        credentials: true
    }
})
const rooms={}
const roomPlayers={}
io.on("connection",(socket)=>{
        console.log("user connected",socket.id)
       
        socket.broadcast.emit("welcome","Welcome to the server")
        socket.on("join-room",(name,roomId)=>{
           
            console.log(roomId)
           
            
             if (!roomPlayers[roomId]) {
                roomPlayers[roomId]=[]; 
                rooms[roomId] = [5,5,5,5,5,5,5];}

                if(roomPlayers[roomId].length>=2){
                    socket.emit("room-full","Room is full, please try another room");
                    return;
                }
                roomPlayers[roomId].push({id:socket.id,name});
                socket.join(roomId)
                
                console.log(roomPlayers)
                const players=roomPlayers[roomId];
                
                if(players.length<2){
                    console.log("waiting......")
                    io.to(roomId).emit("waiting",{
                        
                        message:"Waiting for Players",
                        players
                    })  
                  
                }
                if(players.length===2){
                    console.log(name)
                    const player1=players[0];
                    const player2=players[1];
                        io.to(roomId).emit("joined")
                        io.to(player1.id).emit("opponent-joined", { opponentName: player2.name });
                        io.to(player2.id).emit("opponent-joined", { opponentName: player1.name });
                }
                 

           

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

        socket.on("play-again",(roomId)=>{
            console.log("rematch")
            socket.to(roomId).emit("opponent-want-rematch")
        })

        socket.on("accept-match",(roomId)=>{
            rooms[roomId] = [5,5,5,5,5,5,5];
            io.to(roomId).emit("restart-game")
        })
})
app.get("/",(req,res)=>{
    res.send("Hello")
})
server.listen(PORT,()=>{
console.log("Server is running on port",PORT)
})