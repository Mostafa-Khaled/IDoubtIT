import React from 'react'
import Card, { ICard, /*Type*/ } from './Card'
import Player from './Player'
import { useState, useEffect, useRef } from 'react'

import { doc, setDoc, updateDoc } from "firebase/firestore"; 
import db from '../firebase/methods'

import { useParams } from 'react-router-dom'
import { useDocumentData } from 'react-firebase-hooks/firestore'

import { CSSProperties } from 'react'

import { ranks, timer, initializeDecks } from '../functions/functions'

interface IProps{
  roomID ?: string 
}

interface IUpdateData{
  cards?: Record<string, ICard[]>,
  playedCards?: ICard[], 
  round?: number, 
  rank?: string, 
  time?: number
}

const Table = (props: IProps) => {

  // States   
  const [round, setRound] = useState<number>(0)
  const [playedCards, setPlayedCards] = useState<ICard[]>([]);
  const [selectedCards, setSelectedCards] = useState<ICard[]>([]);
  const [currentRank, setCurrentRank] = useState<string>("");
  const [canPlay, setCanPlay] = useState<boolean>(true);
  const [canDoubt, setCanDoubt] = useState<boolean>(true);
  const [canChangeRank, setCanChangeRank] = useState<boolean>(true);
  const [canPlayCounter, setCanPlayCounter] = useState<number>(0)
  const [canChangeRankCounter, setCanChangeRankCounter] = useState<number>(0)
  const [cards, setCards] = useState<Record<string, ICard[]>>({});
  const [lastPlayTime, setLastPlayTime] = useState<number>(0);
  
  let intervalRef1 = useRef<any>();
  let intervalRef2 = useRef<any>();


  // Initialize 

  const playerID = sessionStorage.getItem("p_id");
  const { id: roomID } = useParams()

  const docRef = doc(db, "doubt", props.roomID || roomID );
  const [roomData, loading, error] = useDocumentData(docRef) ;

  const convertToDeck = (deck: Record<string, ICard[]>[]) : Record<string, ICard []> => {
      const res : Record<string, ICard[]> = {}
      deck.forEach(el =>{
          const playerID = Object.keys(el)[0];
          res[playerID] = el[playerID]
      })
      return res
  }

  const sortPlayers = (players) => players.reduce((acc, element) => {
    if (element === sessionStorage.getItem("p_id")) {
      return [element, ...acc];
    }
    return [...acc, element];
  }, [])

  const updateDeck = async ( updateData : IUpdateData ) => {
    const updatedData = [...(roomData.players)];
    console.log(updateData)
    for(let i = 0; i < updatedData.length; i++){
      const playerID = Object.keys(updatedData[i] )[0]
      updatedData[i][playerID]["cards"] = updateData.cards[playerID]["cards"]
    }
    await updateDoc(docRef, {
      initialized: true
    })
    await updateDoc(docRef, {
      players: updatedData,
      playedCards: updateData.playedCards || playedCards,
      round: updateData.round || round,
      rank: updateData.rank || currentRank,
      lastPlayTime: updateData.time || roomData.lastPlayTime
    })
    if(updateData.time !== undefined){
      setLastPlayTime(updateData.time);
    }
  }

   useEffect(()=>{
    if(!loading && roomData){
      console.log(roomData.lastPlayTime)
      if(roomData.players.length === 4 && !roomData.initialized){
        const playersIDs = roomData.players.map(e=> Object.keys(e)[0] )
        const l_cards = initializeDecks(playersIDs);
        updateDeck({ cards: l_cards});
      }
      setCards(convertToDeck(roomData.players))
      setCurrentRank(roomData.rank)
      setRound(roomData.round);
      setPlayedCards(roomData.playedCards)
      console.log(roomData.lastPlayTime);
      setLastPlayTime(prev => {
        clearInterval(intervalRef1.current);
        clearInterval(intervalRef2.current);
        startPlayCounter(roomData.lastPlayTime);
        startChangeCounter(roomData.lastPlayTime);
        return roomData.lastPlayTime
      });
    }
   },[roomData])

  // Can Play & Change counters 

  const decreasePlayCounter = (time) => setCanPlayCounter((val_) => {
    const date = new Date()
    const val = 10 - Math.floor((date.getTime()-time)/1000);
    if(val > 0){
      setCanPlay(false)
      return val;
    }else{
      setCanPlay(true);
      clearInterval(intervalRef1.current);
      return 0 ;
    }
  });

   const decreaseChangeCounter = (time) => setCanChangeRankCounter((val_) => {
    const date = new Date()
    const val = 20 - Math.floor((date.getTime()-time)/1000);
    console.log(val)
    if(val > 0){
      setCanChangeRank(false)
      return val;
    }else{
      setCanChangeRank(true);
      clearInterval(intervalRef2.current);
      return 0;
    }
  });


   // Start & Stop Counters 

   const startPlayCounter = (time?: number) => {
    intervalRef1.current = setInterval(decreasePlayCounter, 1000, time);
   }

   const startChangeCounter = (time?: number) => {
    intervalRef2.current = setInterval(decreaseChangeCounter, 1000, time);
   }

   const stopPlayCounter = () => {
    clearInterval(intervalRef1.current);
    setCanPlayCounter(0);
    updateDeck({cards, time: 0});
   }
   
   const stopChangeCounter = () => {
    clearInterval(intervalRef2.current);
    setCanChangeRankCounter(0);
    updateDeck({cards, time: 0});
   }

   // Actions Methods

   const changeRank = (event: React.MouseEvent, card: ICard) : void => {
      if(!canChangeRank || playedCards[playedCards.length-1].playerID !== playerID) return;
      setCurrentRank(card.rank);
      updateDeck({cards, playedCards, round, rank: card.rank})
   }

  const makeDoubt = async (event: React.MouseEvent) => {
    stopPlayCounter();
    stopChangeCounter();
    setCanPlay(false)
    setCanDoubt(false)
    await updateDeck({cards, time: -1});
    let idx = playedCards.length - 1, i;
    let round_ = -1;
    let rightGuess = false;
    let loserID = "";
    const played = [...playedCards];
    if(played.length < 1) return;
    for(i = idx; i >= 0; i--){
       if(round_ === -1) round_ = playedCards[idx].round;
       played[i].show = true;
       played[i].zIndex = idx - i;
       setPlayedCards([...played]);
       updateDeck({cards, playedCards: [...played]})
       if(played[i].rank !== currentRank) rightGuess = true;
       await timer(2000);
       if(i > 0 && played[i-1].round !== round_) { i--; break; }
    }
    i++;
    for(i; i <= idx; i++){
       played[i].show = false;
       played[i].zIndex = 0;
    }
    setPlayedCards([...played])
    updateDeck({cards, playedCards: [...played]})
    await timer(2000)
    if(!rightGuess){
      loserID = playerID  
    }else{
      loserID = played[i-1].playerID
    }
    const cards_ = {...cards};
    cards_[loserID]["cards"] = [...cards[loserID]["cards"], ...playedCards];
    setPlayedCards([])
    setCards(cards_)
    setCanDoubt(true)
    setCanPlay(true)
    updateDeck({cards: cards_, playedCards: []})
  }

  const playCards = (event: React.MouseEvent) : void => {
    if(currentRank === "") return;
    stopChangeCounter();
    setCanPlay(false);
    setCanChangeRank(false);
    const playedCards_ : ICard[] = []
    let allCards = {...cards};
    let cards_ = cards[playerID]["cards"];
    selectedCards.forEach(card =>{
      cards_ = cards_.filter(el => el.id !== card.id )
      const card_ = card;
      const rnd = round;
      card_.backed = true;
      card_.round = rnd;
      playedCards_.push(card_)
    })
    allCards[playerID]["cards"] = cards_;
    const res = {};
    Object.keys(allCards).forEach(key =>{
      res[key] = {};
      Object.keys(allCards[key]).forEach(key2 => {
        res[key][key2] = allCards[key][key2]
      })
    })
    setPlayedCards([...playedCards, ...playedCards_])
    setCards(res)
    setRound(round+1);
    setSelectedCards([]);
    updateDeck({
      cards: res, 
      playedCards: [...playedCards, ...playedCards_], 
      time: new Date().getTime()
    })
   }

  // Render
  return(
    <div className="outer-table grid grid-rows-6 justify-items-center items-center">
      <div className = "inner-table relative flex flex-wrap row-start-2 row-end-6 table-border border-2 border-gray-800 rounded-xl artboard artboard-horizontal phone-2 bg-base-300">
      {
        sortPlayers(Object.keys(cards)).map((playerID, idx)=>{
          const cardDeck = cards[playerID]["cards"]
          return  <Player key={playerID} idx={idx} selectCards={setSelectedCards} cards = {cardDeck} id = {playerID}/>
        })
      }
    </div>
    <div className = "top-[18rem] card-area relative w-[5rem] h-[7.25rem] rounded-md border-2 border-red-500 p-10 flex justify-center items-center">
        { playedCards &&
          playedCards.map((card: ICard, idx: number)=>{
            return <div key={card.id+card.show} className='played-card absolute w-[84%] h-[84%] top-[7%] left-[9%]'> 
            <Card id={card.id} rank={card.rank} backed={card.backed} type={card.type} kind={card.kind} zIndex={card.zIndex} show={card.show} selected={card.selected}/> 
            </div>
          })
        }
      </div>
    <div className="player-actions absolute top-[16rem]">
      <div className="buttons relative top-[21rem] -left-[1rem]">
      <button 
      className={`${canPlay && selectedCards.length > 0 ? "bg-primary hover:bg-primary-focus" : "cursor-not-allowed bg-base-200 hover:bg-base-100"} border-white border-[0.1rem] text-white py-2 px-4 rounded m-3`}
      onClick={playCards} disabled={!canPlay || selectedCards.length === 0}> العب </button>
      <button 
      className={`${canDoubt && playedCards.length > 0 && playerID !== playedCards[playedCards.length-1].playerID ? "bg-secondary hover:bg-secondary-focus" : "cursor-not-allowed bg-neutral hover:bg-neutral-focus"} border-white border-[0.1rem] text-white font-bold py-2 px-4 rounded`}
      onClick={makeDoubt} disabled={!canDoubt || playedCards.length === 0 || playerID === playedCards[playedCards.length-1].playerID}> أشك  </button>
      </div>
      <div className="toast toast-middle toast-end counters">
        <div className="radial-progress text-primary mb-3" style={{ "--value": canPlayCounter/10*100, "--size": "12rem", "--thickness": "2px" }as CSSProperties}>
          <span> : الدور القادم </span>
          <span className="countdown font-bold py-2 px-4 rounded m-3"> 
            <span style={{"--value":canPlayCounter} as CSSProperties}></span> 
          </span>
        </div>
        <div className="radial-progress text-info" style={{ "--value": canChangeRankCounter*100/20, "--size": "12rem", "--thickness": "2px" }as CSSProperties}>
          <span> : تغيير الورقة</span>
          <span className="countdown font-bold py-2 px-4 rounded m-3"> 
            <span style={{"--value":canChangeRankCounter} as CSSProperties}></span> 
          </span>
        </div>
      </div>
    </div>
    <div className = "toast toast-start toast-middle">
      <div className = "ranks grid grid-flow-col">
        {
          ranks.map((card: ICard, idx: number) => {
            return <div key={card.id} className={`rank-card ${card.rank === currentRank ? "chosen" : ""} ${idx === 10 ? "row-start-2" : ""}`} onClick={(e)=>changeRank(e, card)}> 
              <Card id={card.id} rank={card.rank} backed={card.backed} type={card.type} kind={card.kind} selected={card.selected}/> 
              </div>
            })
        }
      </div>
    </div>
    </div>
  )
}


export default Table 