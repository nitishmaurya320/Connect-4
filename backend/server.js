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
        origin: [process.env.FRONTEND_URL],// your frontend
        methods: ["GET", "POST"],
        credentials: true
    }
})

const rooms={}
const roomPlayers={}
const roomturns={}
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
                    const player1=players[0];
                    const player2=players[1];
                    console.log(name)
                    roomturns[roomId]=Math.random()<0.5?player1.id:player2.id;
                    
                    
                        io.to(roomId).emit("joined")
                        io.to(player1.id).emit("opponent-joined", { opponentName: player2.name });
                        io.to(player2.id).emit("opponent-joined", { opponentName: player1.name });

                      
                         io.to(roomturns[roomId]).emit("your-turn",true);
                        io.to(roomturns[roomId]===player1.id?player2.id:player1.id).emit("your-turn",false)
                       

                        console.log(roomturns[roomId])

                }
                 

           
           
        })  

         socket.on("send-emoji", (emo,roomId) => {
    console.log(emo);

    const players = roomPlayers[roomId];
    const opponentId = socket.id === players[0].id ? players[1].id : players[0].id;

    io.to(opponentId).emit("received-emoji", emo);
});
        socket.on("message",({name,message,roomId})=>{
             console.log("Message received:", message, "Room:", roomId);
            socket.to(roomId).emit("received-message",{name,message})
        })
        socket.on("make-move",({column,symbol,roomId})=>{
           
           const players=roomPlayers[roomId]
             const row = rooms[roomId][column];
        if (row < 0) return; // column full
        rooms[roomId][column] -= 1;
           io.to(roomId).emit("received-move",column,row,symbol,socket.id)

           const currentPlayer=roomturns[roomId]
           const nextPlayer=currentPlayer===players[0].id?players[1].id:players[0].id
           roomturns[roomId]=nextPlayer;

           io.to(currentPlayer).emit("your-turn",false)
           io.to(nextPlayer).emit("your-turn",true)
        })

        socket.on("play-again",(roomId)=>{
            console.log("rematch")
            socket.to(roomId).emit("opponent-want-rematch")
        })

        socket.on("accept-match",(roomId)=>{
            rooms[roomId] = [5,5,5,5,5,5,5];
            io.to(roomId).emit("restart-game")
        })

       socket.on("disconnect", () => {
  console.log("user disconnected:", socket.id);

  // Find which room the player was in
  let roomId = null;
  for (const id in roomPlayers) {
    const players = roomPlayers[id];
    const playerIndex = players.findIndex((p) => p.id === socket.id);
    if (playerIndex !== -1) {
      roomId = id;
      players.splice(playerIndex, 1); // remove the player
      console.log(`Removed ${socket.id} from room ${roomId}`);

      // Notify the other player that their opponent left       
       players.forEach(p => {
        io.to(p.id).emit("playerLeft", { message: `Opponent left the game.` });
      });


      // Cleanup if the room is empty
      if (players.length === 0) {
        delete roomPlayers[id];
        delete rooms[id];
        delete roomturns[id];
        console.log(`Room ${roomId} deleted because it's empty.`);
      }
      break;
    }
  }
});

socket.on("match-draw",({data,id})=>{
    io.to(id).emit("match-draw",data)
})
})
app.get("/",(req,res)=>{
    res.send("Hello")
})
server.listen(PORT,()=>{
console.log("Server is running on port",PORT)
})