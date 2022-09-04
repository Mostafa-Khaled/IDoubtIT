import React from 'react';
import './App.css';
import './index.css';
import Todos from './components/Todos';
import Test from './components/Test';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'


class App extends React.Component {
  render() : React.ReactNode{
    return (
      <div>
        <BrowserRouter>
          <div className = "relative">
            <nav className='flex fixed top-0 w-screen divide-x divide-gray-200 flex-row text-white p-2 bg-gray-900'>
              <Link className='p-2 hover:bg-gray-800 transition-all transition-duration-500' to = "/todo"> Todo </Link>
              <Link className='p-2 hover:bg-gray-800 transition-all transition-duration-500' to = "/test"> Test </Link>
            </nav>
          </div>
          <Routes>
            <Route path = "/todo" element = { <Todos /> }/>
            <Route path = "/test" element = { <Test /> }/>
          </Routes>
        </BrowserRouter>
      </div>
    )
  }
}
// https://www.youtube.com/watch?v=KufsL2VgELo Group Theory
export default App;