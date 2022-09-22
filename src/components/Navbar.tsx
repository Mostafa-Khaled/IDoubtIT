import React from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'

interface IProps{
    isLogged ?: boolean,
    logout ?: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar : React.FC<IProps> = (props : IProps) => {
  const logout = () : void => {
    localStorage.removeItem("__ID");
    props.logout(false);
  }
  return (
    <nav className="w-screen grid grid-cols-12 bg-teal-700 text-white shadow-lg">
        <Link className="text-bold text-center col-start-1 cols-span-3 navbar-item" to = "/"> Logo </Link>
        <Link className = "navbar-item col-start-10" to = "/"> Dashboard </Link>
        { !props.isLogged ? <Link className = "col-start-11 navbar-item" to = "/register"> Register </Link> : 
        <Link className = "col-start-11 navbar-item" to="/me"> Profile </Link> }
        { !props.isLogged ? <Link className = "col-start-12 navbar-item" to = "/login"> Login </Link>
        : <Link className = "col-start-12 navbar-item" to = "/logout" onClick={logout}> Logout </Link> }
    </nav>
  )
}

export default Navbar