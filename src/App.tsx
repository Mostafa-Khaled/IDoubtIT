import React from 'react';
import './App.css';
import './index.css';
import Card from './Card';
//import { useState, useEffect } from 'react'

class App extends React.Component {
    render(): React.ReactNode {
      return(
        <div>
          <Card />
        </div>
      )
    }
}


export default App;
