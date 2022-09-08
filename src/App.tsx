import React from 'react';
import './App.css';
import './index.css';
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'


const App = () => {
    const [user, setUser] = useState<string>("");
    return (
      <Router>
        <div className="container flex">
            <Routes>
                <Route path="/" element = {<Dashboard />} />
                <Route path="/logout" element = {<Navigate to="/" />} />
                <Route path="/register" element = {<Register />} />
                <Route path="/login" element = {<Login loginUser={setUser}/>} />
            </Routes>
        </div>
      </Router>
    )
}
// https://www.youtube.com/watch?v=KufsL2VgELo Group Theory
export default App;