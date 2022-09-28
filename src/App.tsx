import React from 'react';
import './App.css';
import './index.css';
import Card, { ICard } from './Card';
// import Deck from './Deck'
import Table from './Table'
import Player from './Player'
import { useState, useEffect } from 'react'

interface IProps{

}

const App = (props: IProps) => {
  return (
    <div className = "w-screen h-screen bg-gray-800 flex justify-center items-center overflow-hidden">
      <Table />
      {/*<Deck size={3}/>*/}
      
    </div>
  )
}


export default App;
