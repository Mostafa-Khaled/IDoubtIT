import React from 'react'
//import db, { checkAvailableRoom } from '../firebase/methods'
//import { doc, getDoc, setDoc } from 'firebase/firestore'

import { doc, setDoc } from "firebase/firestore"; 
import { useDocumentData } from 'react-firebase-hooks/firestore'
import db from '../firebase/methods'


import { useEffect, useState } from 'react'

import uid from '../functions/uid'
import { initializeDecks } from '../functions/functions'
interface IProps{

}

const Test = (props : IProps) => {
  //const isRoomAvailable = checkAvailableRoom("mk71nNSE").then(res => console.log(res));
const docRef = doc(db, "doubt", "3xU0E8")

const [playersData, loading, error] = useDocumentData(docRef) ;

useEffect(()=>{
  if(!loading && playersData){
    setDoc(doc(db, "doubt", "aaa"), playersData)
  }
},[playersData])  

	return ( 
		<div className="w-screen h-screen bg-neutral flex justify-center items-center">
      <button className="btn btn-outline btn-primary"> Generate </button>
		</div>
	)
}


export default Test	