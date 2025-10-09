import React from 'react'
import Game from './Game'

const LocalGame = () => {
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
    <Game id="000" myTurn={true} mode="local"/>     
  </div>
  )
}

export default LocalGame