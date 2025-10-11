  import React, { useEffect, useState } from 'react'
  import socket from './socket';
import { useNavigate } from 'react-router-dom';
 
  const Game = ({id,myTurn,mode}) => {
   
      // const [move,setMove]=useState('');
      const [clickCount,setClickCount]=useState(0);
     const [leaveMessage,setLeaveMessage]=useState("")
      const [waitingRematch,setWaitingRematch]=useState("")
      const [drawMessage,setDrawMessage]=useState(false)
      const [winningCells,setWinningCells]=useState([])
      const [box,setBox]=useState([['','','','','','',''],

        
                  ['','','','','','',''],
                  ['','','','','','',''],
                  ['','','','','','',''],
                  ['','','','','','',''],
                ['','','','','','','']])
      const [rowFilled,setRowFilled]=useState([5,5,5,5,5,5,5])
      const [winner,setWinner]=useState("");
      const handleJoinRoom=()=>{
       window.location.href="/join-room"
         
      }

      const applyMove=(column,serverRow,symbol)=>{
        const targetRow = serverRow
          if (targetRow< 0) return; // column is full
          setBox(prevBox=> {
      const newBox = prevBox.map(row => [...row]);
      
      
      
      
      

      
      
          newBox[targetRow][column] = symbol
      // if(column>=3&&(newBox[targetRow][column]===newBox[targetRow][column-1])&&(newBox[targetRow][column-1]===newBox[targetRow][column-2])&&(newBox[targetRow][column-2]===newBox[targetRow][column-3])||
      // column<=3&&(newBox[targetRow][column]===newBox[targetRow][column+1])&&(newBox[targetRow][column+1]===newBox[targetRow][column+2])&&(newBox[targetRow][column+2]===newBox[targetRow][column+3])||
      // (targetRow>=3)&&(column>=3)&&(newBox[targetRow][column] === newBox[targetRow-1][column-1] &&
      //   newBox[targetRow-1][column-1] === newBox[targetRow-2][column-2] &&
      //   newBox[targetRow-2][column-2] === newBox[targetRow-3][column-3])||

      //   (targetRow<=2&&column<=3)&&(newBox[targetRow][column] === newBox[targetRow+1][column+1] &&
      //   newBox[targetRow+1][column+1] === newBox[targetRow+2][column+2] &&
      //   newBox[targetRow+2][column+2] === newBox[targetRow+3][column+3])||

      //   (targetRow<=2)&&(newBox[targetRow][column] === newBox[targetRow+1][column] &&
      //   newBox[targetRow+1][column] === newBox[targetRow+2][column] &&
      //   newBox[targetRow+2][column] === newBox[targetRow+3][column])||

      //   (targetRow>=3)&&(newBox[targetRow][column] === newBox[targetRow-1][column] &&
      //   newBox[targetRow-1][column] === newBox[targetRow-2][column] &&
      //   newBox[targetRow-2][column] === newBox[targetRow-3][column])||

      //   (targetRow>=3&&column<=3)&&(newBox[targetRow][column] === newBox[targetRow-1][column+1] &&
      //   newBox[targetRow-1][column+1] === newBox[targetRow-2][column+2] &&
      //   newBox[targetRow-2][column+2] === newBox[targetRow-3][column+3])||

      //   (targetRow<=2&&column>=3)&&(newBox[targetRow][column] === newBox[targetRow+1][column-1] &&
      //   newBox[targetRow+1][column-1] === newBox[targetRow+2][column-2] &&
      //   newBox[targetRow+2][column-2] === newBox[targetRow+3][column-3])
        

        
      
        
        
      // ){
      //   setTimeout(()=>{
      //       setWinner(newBox[targetRow][column])
      //   },800)
          
       
        
      // }
      const checkWin = (board, row, col, symbol) => {
  const directions = [
    [0, 1],  // → horizontal
    [1, 0],  // ↓ vertical
    [1, 1],  // ↘ diagonal
    [1, -1], // ↙ diagonal
  ];

  for (let [dr, dc] of directions) {
    let count = 1;
      let cells=[{row,col}]
    // Check one direction
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= 6 || c < 0 || c >= 7 || board[r][c] !== symbol) break;
      cells.push({row:r,col:c})
      
    }

    // Check the opposite direction
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= 6 || c < 0 || c >= 7 || board[r][c] !== symbol) break;
      cells.push({row:r,col:c})
      
    }

    if (cells.length >= 4){

       return {winner:symbol,cells} 
    }
  }

  return null;
};

      if(clickCount+1===42){
         setDrawMessage(true)
         socket.emit("match-draw",{data:true,id})

      }
     const result = checkWin(newBox, targetRow, column, symbol);
if (result) {
  setWinningCells(result.cells);
  setTimeout(() => setWinner(result.winner), 2000);
} return newBox;
      });
      

    
  };

  const handleMove = (column,roomId) => {
     if (!myTurn || winningCells.length===4) return; // prevent moves when not your turn or game ended
    // const symbol = myTurn ? 'X' : 'O';
     const audio=new Audio('/clack.mp3')
     audio.play()
    const symbol = clickCount % 2 === 0 ? '🔴' : '🔵';
   const row = rowFilled[column];
if (row < 0) return; // column full
applyMove(column, row, symbol);
     setRowFilled(prev => {
    const newRow = [...prev];
    newRow[column] -= 1;
    return newRow;
  });
   setClickCount(prev => prev + 1);
   if(mode!="local"){
     socket.emit("make-move",{column,symbol,roomId})
   }
 
      
   
      
      
    };
    
     const clearBoard=()=>{
      setWinningCells([]);
         setWaitingRematch("")
        setWinner("");
          setBox([
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
  ]);
  setRowFilled([5, 5, 5, 5, 5, 5, 5]);
  setClickCount(0);
  setDrawMessage("")
  
    }
      useEffect(() => {
         
        if(mode!=="local"){

        
      socket.on("received-move", ( column,row, symbol,playerId) => {
        
        if(playerId!=socket.id){
            setClickCount(prev => prev + 1);
          
             applyMove(column,row, symbol);
             
             setRowFilled(prev => {
            const newRow = [...prev];
            newRow[column] = row - 1; // decrement as opponent filled
            return newRow;

      });
        }
       
      });

      socket.on("opponent-want-rematch",()=>{
        setWaitingRematch("Opponent wants rematch")
        
      })
     
      socket.on("restart-game",()=>{
        clearBoard();

      })
        socket.on("playerLeft",(data)=>{
          
          setLeaveMessage(data.message)
          
        })
        socket.on("match-draw",(data)=>{
          setDrawMessage(data)
        })
      }
      return () => {
        socket.off("received-move");
      };
    }, []);

 

    return (
    <>
    {  drawMessage&&<div className="fixed inset-0 flex items-center justify-center  bg-opacity-60 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Match Draw</h2>
        
        
        <button
          onClick={() => {
          if(mode==="local"){
             clearBoard();
            return;
          }
          socket.emit("play-again", id);
          setWaitingRematch("Waiting for your opponent to confirm rematch");
        }}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition duration-300"
        >
          Play Again
        </button>
        
      </div>
    </div>}
    {  leaveMessage&&<div className="fixed inset-0 flex items-center justify-center  bg-opacity-60 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">⚠️ Opponent Left</h2>
        <p className="text-gray-600 mb-6">{leaveMessage || "Your opponent has left the game."}</p>
        
        <button
          onClick={handleJoinRoom}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition duration-300"
        >
          Join Another Room
        </button>
        
      </div>
    </div>}
    {winner && (
  <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50 backdrop-blur-sm animate-fadeIn">
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-2xl p-10 w-96 text-center transform scale-95 animate-scaleUp">
      
      <h2 className="text-3xl font-extrabold mb-4 text-white drop-shadow-lg">
        🎉 {winner} Wins!
      </h2>
      
      <p className="text-white/90 mb-6 text-lg">
        Congratulations! 🎊
      </p>

      {/* Play Again Button */}
      <button
        onClick={() => {
          if(mode==="local"){
            clearBoard();
            return;
          }
          socket.emit("play-again", id);
          setWaitingRematch("Waiting for your opponent to confirm rematch");
        }}
        className="px-8 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-2xl shadow-lg hover:bg-white/30 transition transform hover:scale-105"
      >
        🔄 Play Again
      </button>

      {/* Optional Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className={`absolute w-2 h-2 bg-yellow-300 rounded-full confetti`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              top: "-5%",
            }}
          />
        ))}
      </div>
    </div>
  </div>
)}

      {waitingRematch && (
  <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50 backdrop-blur-sm animate-fadeIn">
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl shadow-2xl p-8 w-96 text-center transform scale-95 animate-scaleUp">
      
      <h2 className="text-2xl font-bold mb-3 text-white drop-shadow-lg">
        ⏳ {waitingRematch}
      </h2>
      
      <p className="text-white/90 mb-6">
        Please wait for your opponent to confirm the rematch.
      </p>
      
      {waitingRematch === "Opponent wants rematch" && (
        <button
          onClick={() => socket.emit("accept-match", id)}
          className="px-8 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-2xl shadow-lg hover:bg-white/30 transition transform hover:scale-105"
        >
          ✅ Confirm
        </button>
      )}

      {/* Optional subtle animation dots */}
      <div className="flex justify-center space-x-2 mt-4">
        <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></span>
        <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-400"></span>
      </div>
      
    </div>
  </div>
)}


    <div className="max-w-[490px] m-1 aspect-[7/6] w-full  ">
      <div className="grid grid-cols-7 grid-rows-6 place-items-center  h-full bg-yellow-500 border-2 w-full">
        {box.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
          <button
    key={`${rowIndex}-${colIndex}`}
    onClick={() => handleMove(colIndex,id)}  
    className="w-[70%] h-[70%]  bg-white   rounded-[50%]  flex items-center justify-center"
  >
    <div className={`h-full w-full ${cell ? "animate-drop" : ""} rounded-full flex items-center justify-center`}>
  <div className={`${winningCells.some(c => c.row === rowIndex && c.col === colIndex) ? (cell==='🔴'?"animate-pulse-red":"animate-pulse-blue"): ""} h-full overflow-hidden rounded-[50%] text-[9vw] md:text-[55px]  w-full flex items-center justify-center`}>
    {cell}
  </div>
</div>

  </button>

          ))
        )}
      </div>
      
    </div>
  </>

    )
  }

  export default Game