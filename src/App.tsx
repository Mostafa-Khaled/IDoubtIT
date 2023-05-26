import React from 'react';
import { Routes, Route } from "react-router-dom"

import './App.css';
import './index.css';

// import Card, { ICard } from './Components/Card';
import Table from './components/Table'
import Waiting from './components/Waiting'
// import Player from './Components/Player'
import Home from './components/Home'
import Test from './components/Test'
import NotFound from './components/NotFound'
// import { CSSProperties } from "react";


// import { useState, useEffect } from 'react'


interface IProps{

}

const App = (props: IProps) => {
  return (
    <div data-theme="halloween" className = "w-screen h-screen bg-neutral flex justify-center items-center overflow-hidden">
      
      <Routes>
        <Route path="/" element={ <Home /> } />
        {/*<Route path="/:lang" element={ <Home /> } />*/}
        <Route path="/game/:id" element = { <Waiting />  } />
        <Route path="/test" element = {<Test/>}/>
        <Route path="/not" element = {<NotFound/>}/>
        <Route path="*" element = {<NotFound/>}/>
      </Routes>

    </div>
  )
}


export default App;
