import React from 'react'
import { useRef, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";

import { doc, setDoc, getDoc } from 'firebase/firestore'
import db from '../firebase/methods'

import uid from '../functions/uid'
import messages from '../functions/messages'
import { IPlayerData } from '../functions/interfaces'

import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

import Modal from './Modal'

interface IProps{

}

type IPlayersData = Record<string, IPlayerData>[];

const Home = (props: IProps) => {

  // States & Refs
  const { lang } = useParams();
  const msgs = messages[(lang in messages ? lang : "ar")];
  const [userID, setUserID] = useState<string|undefined>(sessionStorage.getItem("p_id"));
  const [userName, setUserName] = useState<string|undefined>(sessionStorage.getItem("p_name"));
  const [errorMsg, setErrorMsg] = useState<string>("");
  const nameInput = useRef<HTMLInputElement>();
  const roomInput = useRef<HTMLInputElement>();
  const navigate = useNavigate();


  // Methods 
  const throwError = (msg: string) : void => {
    setErrorMsg(prev => msg)
  }

  const createUser = async () => {
    const name = nameInput.current.value;
    const userName = sha256(name + (~~(Math.random()*36**6)).toString());
    const uID = userName.toString(Base64);
    sessionStorage.setItem("p_id", uID);
    sessionStorage.setItem("p_name", name);
    setUserID(uID);
    setUserName(name);
  }

  const createRoom = async () => {
    if(Object.keys(sessionStorage).includes('p_id')){
      const roomID = await uid();
      const docRef = doc(db, "doubt", roomID);
      const playersData : IPlayersData = [{}];
      const playerData : IPlayerData = { name: userName } 
      playersData[0][userID] = playerData;
      const createDoc = await setDoc(docRef,{
        players: playersData
      })
      navigate(`/game/${roomID}`)
    }else{
      throwError(msgs.userNotExist);
    }
  }

  const joinRoom = async () => {
    if(Object.keys(sessionStorage).includes('p_id')){
      const roomID = roomInput.current.value;
      const docRef = doc(db, "doubt", roomID);
      const docRawData = await getDoc(docRef);
      const docData = docRawData.data();
      if(!docRawData.exists() || docData === undefined){
        throwError(msgs.roomNotExist); 
        return;
      }
      const players: IPlayersData = docData.players;
      const playerData : Record<string, IPlayerData>= {};
      playerData[userID] = { name: userName }
      if(players.length < 1 || players.length > 3){
        throwError(msgs.roomFull);
      }else{
        if(!(userID in players)){
          await setDoc(docRef,{
            initialized: false
          })
          await setDoc(docRef, { 
            players : [...players, playerData]
          })
        }
        navigate(`/game/${roomID}`)
      }
    }else{
      throwError(msgs.userNotExist);
    }
  }
  // Render

	return (
    <div className="form-control w-full max-w-xs">
      <div className="flex flex-col w-full border-opacity-50">
        {!userID ? 
          <>
            <label className="label justify-self-center">
              <span className="label-text">{msgs.askName}</span>
            </label>
            <input ref={nameInput} maxLength={10} type="text" placeholder={msgs.enterName} className="input input-bordered w-full max-w-xs mb-8" />
            <button className="btn btn-outline btn-primary my-2" 
            onClick = {() => createUser()}> {msgs.register}  </button>
          </> : 
          <> 
          <h1 className="text-3xl text-center mb-3"> {msgs.greeting}
            <span className="font-bold text-primary" > { userName } </span> 
          </h1> 
          <div className="card w-auto bg-base-100 shadow-xl">
            <div className="card-body">
              <button className="btn btn-outline btn-primary my-2" 
              onClick = {() => createRoom()}> {msgs.create} </button>
              <div className="divider">{msgs.or}</div>
              <label className="label">
                <span className="label-text">{msgs.owns}</span>
              </label>
              <input ref={roomInput} type="text" maxLength={6} placeholder={msgs.enterCode}className="input input-bordered w-full max-w-xs" />
              <button className="btn btn-outline btn-primary my-2" onClick={joinRoom}> {msgs.join}</button>
            </div>
          </div>
          </>
        }
      </div>
      <Modal msg={errorMsg} msgs={msgs} rtl={!(lang in messages) || lang === "ar"}/>
    </div>
  )
}

export default Home