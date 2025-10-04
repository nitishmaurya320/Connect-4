  import React, { useEffect, useState } from 'react'
  import socket from './socket';
  const Game = ({id}) => {
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
      // const [rowFilled,setRowFilled]=useState([5,5,5,5,5,5])
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
        setWinner(newBox[targetRow][column])
        
      }


      return newBox;
      });
    //   setRowFilled(prevRow => {
    //   const newRowFilled = [...prevRow];
    //   newRowFilled[column] -= 1;
    //   return newRowFilled;
    // });

    
  };

console.log(clickCount)
  const handleMove = (column,roomId) => {
    const symbol = clickCount % 2 === 0 ? 'X' : 'O';
  socket.emit("make-move",{column,symbol,roomId})
      setClickCount(prev => prev + 1);
    
      
      
    };
      useEffect(() => {
      socket.on("received-move", ( column,row, symbol) => {
        applyMove(column,row, symbol);
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
  // setRowFilled([5, 5, 5, 5, 5, 5, 5]);
  setClickCount(0);

      })

      return () => {
        socket.off("received-move");
      };
    }, []);



    return (
    <>
    {winner&&<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-96 text-center">
          <h2 className="text-2xl font-bold mb-4">
            🎉 {winner} {waitingRematch} Wins!
          </h2>
          <p className="text-gray-600 mb-6">
            Congratulations to player {winner} 🎊
          </p>
          
            <button
            onClick={()=>{
              socket.emit("play-again",(id) ,
            setWaitingRematch("Waiting for you opponent to confirm rematch"))}}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition"
          >
            Play Again
          </button>
          
        </div>
      </div>}
      {waitingRematch && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-xl font-semibold mb-3">⏳ {waitingRematch}</h2>
        <p className="text-gray-600">Please wait for your opponent to confirm the rematch.</p>
        {waitingRematch==="Opponent wants rematch"&&<button

            onClick={()=>{socket.emit("accept-match",id)}}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition"
          >
            Confirm
          </button>}
      </div>
    </div>
  )}

    <div className="max-w-150 w-full ">
      <div className="grid grid-cols-7 grid-rows-6  max-w-150   h-[360px] bg-green-200 border-2 w-full">
        {box.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
          <button
    key={`${rowIndex}-${colIndex}`}
    onClick={() => handleMove(colIndex,id)}
    className="w-full h-full border border-red-500 flex items-end justify-center overflow-hidden relative"
  >
    <div
      className={`text-2xl transition-transform duration-300`}
      style={{
        transform: cell ? 'translateY(-50%)' : 'translateY(-100%)',
      }}
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