import React, { useEffect, useState } from 'react'
import socket from './socket';
const Game = ({id}) => {
  console.log(id)
    // const [move,setMove]=useState('');
    const [clickCount,setClickCount]=useState(0);
    const [box,setBox]=useState([['','','','','',''],
                ['','','','','',''],
                ['','','','','',''],
                ['','','','','',''],
                ['','','','','','']])
    const [rowFilled,setRowFilled]=useState([4,4,4,4,4,4])
    const [winner,setWinner]=useState("");

    const applyMove=(column,serverRow,symbol)=>{
      const targetRow = serverRow !== undefined ? serverRow : rowFilled[column];
        if (targetRow< 0) return; // column is full
        setBox(prevBox=> {
    const newBox = prevBox.map(row => [...row]);
    
    
    
    
    console.log(targetRow,column)

    
    
        newBox[targetRow][column] = symbol
    if(column>=3&&(newBox[targetRow][column]===newBox[targetRow][column-1])&&(newBox[targetRow][column-1]===newBox[targetRow][column-2])&&(newBox[targetRow][column-2]===newBox[targetRow][column-3])||
    column<=2&&(newBox[targetRow][column]===newBox[targetRow][column+1])&&(newBox[targetRow][column+1]===newBox[targetRow][column+2])&&(newBox[targetRow][column+2]===newBox[targetRow][column+3])||
    (targetRow>=3)&&(column>=3)&&(newBox[targetRow][column] === newBox[targetRow-1][column-1] &&
      newBox[targetRow-1][column-1] === newBox[targetRow-2][column-2] &&
      newBox[targetRow-2][column-2] === newBox[targetRow-3][column-3])||

      (targetRow<=1&&column<=2)&&(newBox[targetRow][column] === newBox[targetRow+1][column+1] &&
      newBox[targetRow+1][column+1] === newBox[targetRow+2][column+2] &&
      newBox[targetRow+2][column+2] === newBox[targetRow+3][column+3])||

      (targetRow<=1)&&(newBox[targetRow][column] === newBox[targetRow+1][column] &&
      newBox[targetRow+1][column] === newBox[targetRow+2][column] &&
      newBox[targetRow+2][column] === newBox[targetRow+3][column])||

      (targetRow>=3)&&(newBox[targetRow][column] === newBox[targetRow-1][column] &&
      newBox[targetRow-1][column] === newBox[targetRow-2][column] &&
      newBox[targetRow-2][column] === newBox[targetRow-3][column])||

      (targetRow>=3&&column<=2)&&(newBox[targetRow][column] === newBox[targetRow-1][column+1] &&
      newBox[targetRow-1][column+1] === newBox[targetRow-2][column+2] &&
      newBox[targetRow-2][column+2] === newBox[targetRow-3][column+3])||

      (targetRow<=1&&column>=3)&&(newBox[targetRow][column] === newBox[targetRow+1][column-1] &&
      newBox[targetRow+1][column-1] === newBox[targetRow+2][column-2] &&
      newBox[targetRow+2][column-2] === newBox[targetRow+3][column-3])
      

      
    
      
      
    ){
      setWinner(newBox[targetRow][column])
      
    }


    return newBox;
    });
    setRowFilled(prevRow => {
    const newRowFilled = [...prevRow];
    newRowFilled[column] -= 1;
    return newRowFilled;
  });

  setClickCount(prev => prev + 1);
};


const handleMove = (column,roomId) => {
  const symbol = clickCount % 2 === 0 ? 'X' : 'O';
socket.emit("make-move",{column,symbol,roomId})
    
  
    
    
  };
     useEffect(() => {
    socket.on("received-move", ( column,row, symbol) => {
      applyMove(column,row, symbol);
    });

    return () => {
      socket.off("received-move");
    };
  }, []);



  return (
   <>
   {winner&&<div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 bg-amber-200 z-1 p-10 '>
   <p>{winner} is the winnder</p>
   <button onClick={()=>{setWinner("")}}>Close</button>
   </div>}
  <div className="max-w-150 w-full p-4">
    <div className="grid grid-cols-6 grid-rows-5  max-w-150   h-[360px] bg-green-200 border-2 w-full">
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