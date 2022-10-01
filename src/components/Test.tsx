import React from 'react'
//import db, { checkAvailableRoom } from '../firebase/methods'
//import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import uid from '../functions/uid'

interface IProps{

}

const Test = (props : IProps) => {
  //const isRoomAvailable = checkAvailableRoom("mk71nNSE").then(res => console.log(res));

  const [x, setX] = useState<string>("");

  const generateUID = () => {
    const w = uid().then(res => setX(res));
  }

	return ( 
		<div className="w-screen h-screen bg-neutral flex justify-center items-center">
      <button className="btn btn-outline btn-primary" onClick={generateUID}> Generate </button>
      <span className="m-5"> {x} </span>
		</div>
	)
}


export default Test	