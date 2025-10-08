  import React, { useEffect, useState } from 'react'
  import socket from './socket';
  const Game = ({id,myTurn}) => {
    console.log(id)
      // const [move,setMove]=useState('');
      const [clickCount,setClickCount]=useState(0);
     
      const [waitingRematch,setWaitingRematch]=useState("")
      const [box,setBox]=useState([['','','','','','',''],
        
                  ['','','','','','',''],
                  ['','','','','','',''],
                  ['','','','','','',''],
                  ['','','','','','',''],
                ['','','','','','','']])
      const [rowFilled,setRowFilled]=useState([5,5,5,5,5,5,5])
      const [winner,setWinner]=useState("");

      const applyMove=(column,serverRow,symbol)=>{
        const targetRow = serverRow
          if (targetRow< 0) return; // column is full
          setBox(prevBox=> {
      const newBox = prevBox.map(row => [...row]);
      
      
      
      
      console.log(targetRow,column)

      
      
          newBox[targetRow][column] = symbol
      if(column>=3&&(newBox[targetRow][column]===newBox[targetRow][column-1])&&(newBox[targetRow][column-1]===newBox[targetRow][column-2])&&(newBox[targetRow][column-2]===newBox[targetRow][column-3])||
      column<=3&&(newBox[targetRow][column]===newBox[targetRow][column+1])&&(newBox[targetRow][column+1]===newBox[targetRow][column+2])&&(newBox[targetRow][column+2]===newBox[targetRow][column+3])||
      (targetRow>=3)&&(column>=3)&&(newBox[targetRow][column] === newBox[targetRow-1][column-1] &&
        newBox[targetRow-1][column-1] === newBox[targetRow-2][column-2] &&
        newBox[targetRow-2][column-2] === newBox[targetRow-3][column-3])||

        (targetRow<=2&&column<=3)&&(newBox[targetRow][column] === newBox[targetRow+1][column+1] &&
        newBox[targetRow+1][column+1] === newBox[targetRow+2][column+2] &&
        newBox[targetRow+2][column+2] === newBox[targetRow+3][column+3])||

        (targetRow<=2)&&(newBox[targetRow][column] === newBox[targetRow+1][column] &&
        newBox[targetRow+1][column] === newBox[targetRow+2][column] &&
        newBox[targetRow+2][column] === newBox[targetRow+3][column])||

        (targetRow>=3)&&(newBox[targetRow][column] === newBox[targetRow-1][column] &&
        newBox[targetRow-1][column] === newBox[targetRow-2][column] &&
        newBox[targetRow-2][column] === newBox[targetRow-3][column])||

        (targetRow>=3&&column<=3)&&(newBox[targetRow][column] === newBox[targetRow-1][column+1] &&
        newBox[targetRow-1][column+1] === newBox[targetRow-2][column+2] &&
        newBox[targetRow-2][column+2] === newBox[targetRow-3][column+3])||

        (targetRow<=2&&column>=3)&&(newBox[targetRow][column] === newBox[targetRow+1][column-1] &&
        newBox[targetRow+1][column-1] === newBox[targetRow+2][column-2] &&
        newBox[targetRow+2][column-2] === newBox[targetRow+3][column-3])
        

        
      
        
        
      ){
        setTimeout(()=>{
            setWinner(newBox[targetRow][column])
        },800)
          
       
        
      }
      

      return newBox;
      });
      

    
  };

console.log(clickCount)
  const handleMove = (column,roomId) => {
     if (!myTurn || winner) return; // prevent moves when not your turn or game ended
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
  socket.emit("make-move",{column,symbol,roomId})
      
    
      
      
    };
      useEffect(() => {
         

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

      })

      return () => {
        socket.off("received-move");
      };
    }, []);

    console.log(myTurn)

    return (
    <>
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
            className={`absolute w-2 h-2 bg-yellow-300 rounded-full animate-confetti`}
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
    className="w-[70%] h-[70%]  bg-white rounded-[50%]   flex items-center justify-center overflow-hidden "
  >
    <div
      className={`h-full w-full text-[9vw] md:text-[55px] ${cell?"animate-drop":""}  rounded-[50%] flex items-center justify-center transition-transform duration-800`}

    >
      {cell} 
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