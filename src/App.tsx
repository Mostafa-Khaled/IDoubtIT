import React from 'react';
import './App.css';
import './index.css';
import Card from './Card';
import Deck from './Deck'
import { useState, useEffect } from 'react'

interface IProps{

}

const App = (props: IProps) => {
  return (
    <div>
      <Deck />
    </div>
  )
}


export default App;
