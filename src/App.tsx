import React from 'react';
import Hangman from './Hangman';
import './App.css';
import './index.css';
//import NumberList from './NumberList';
//import { useState, useEffect } from 'react'

class App extends React.Component {
    render(): React.ReactNode {
      return(<div className="App">
        <Hangman />
      </div>)
    }
}


export default App;
