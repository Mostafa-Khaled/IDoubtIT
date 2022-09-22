import React from 'react';
import './App.css';
import './index.css';
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'


const App = () => {
    const userID: string = localStorage.getItem("__ID") || ""; 
    const [user, setUser] = useState<string>(userID);
    const [isLogged, setLogged] = useState<boolean>((userID !== "")&&(userID !== undefined));
    const updateUserState = (_ID : string) =>{
      setUser(_ID);
      if(_ID) setLogged(true);
    }
    return (
      <Router>
        <Navbar isLogged={isLogged} logout={setLogged}/>
        <div className="">
            <Routes>
                <Route path="/" element = {<Dashboard />} />
                <Route path="/logout" element = {<Navigate to="/" />} />
                <Route path="/register" element = {<Register isLogged={isLogged}/>} />
                <Route path="/login" element = {<Login loginUser={updateUserState}/>} />
                <Route path="/me" element = {<></>} />
            </Routes>
        </div>
      </Router>
    )
}
// https://www.youtube.com/watch?v=KufsL2VgELo Group Theory
export default App;