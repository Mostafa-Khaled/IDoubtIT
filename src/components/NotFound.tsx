import React from 'react'
import { Link } from 'react-router-dom'

interface IProps{
  msg ?: string
  type ?: string
}

const NotFound = (props: IProps) => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="card w-[100%]">
        <div className="card-body items-center text-start">
        <div className="flex w-full px-10 pt-10 mb-5"> 
          <div className="flex h-20 flex-grow justify-end basis-5/12 font-bold text-4xl text-primary">404</div>
          <div className="divider divider-horizontal"></div>
          <div className="flex h-20 flex-grow basis-7/12 flex-col">
            <h1 className="font-bold text-4xl mb-4"> {props.type || "Page"} not found </h1>
            <p className="text-lg text-stone-500"> { props.msg || "Please check if you are in the right place"} </p>
          </div>
        </div>
          <div className="card-actions">
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound