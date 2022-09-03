import React from 'react';
import './App.css';
import './index.css';
import Machine from './Machine';
//import { useState, useEffect } from 'react'

class App extends React.Component {
    render(): React.ReactNode {
      return(<div className="App">
        <h1 className="bg-gray-800 text-white text-2xl p-3 hover:bg-gray-900 transition-all transition-duration:500"> Play !! </h1>
        <Machine s1 = "x" s2 = "x" s3 = "x"/>
        <Machine s1 = "y" s2 = "x" s3 = "x"/>
        <Machine s1 = "x" s2 = "z" s3 = "x"/>
      </div>)
    }
}


export default App;
