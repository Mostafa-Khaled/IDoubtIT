import React from 'react'
import Card, { ICard, /*Type*/ } from './Card'
import Player from './Player'
import { useState, useEffect, useRef } from 'react'

// import { collection, addDoc } from "firebase/firestore"; 
// import db from '../Firebase/methods'

import { CSSProperties } from 'react'

import { ranks, timer, initializeDecks } from '../functions/functions'

interface IProps{

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
  const [cards, setCards] = useState<any>([[]]);
  
  let intervalRef1 = useRef<any>();
  let intervalRef2 = useRef<any>();


  // Initialize 

  const playerID = localStorage.getItem("p_id");

   useEffect(()=>{
      initializeDecks(setCards)
    // (async()=>{
    //   try {
    //     const docRef = await addDoc(collection(db, "doubt"), {
    //       player1: cards_[0],
    //       player2: cards_[1],
    //       player3: cards_[2],
    //       player4: cards_[3]
    //     });
    //     console.log("Document written with ID: ", docRef.id);
    //   } catch (e) {
    //     console.error("Error adding document: ", e);
    //   }
    // })()

   },[]) 

  // Can Play & Change counters 

  const decreasePlayCounter = () => setCanPlayCounter((val) => {
    if(val > 0) return val - 1;
    else{
      setCanPlay(true);
      clearInterval(intervalRef1.current);
      return val ;
    }
  });

   const decreaseChangeCounter = () => setCanChangeRankCounter((val) => {
    if(val > 0) return val - 1;
    else{
      setCanChangeRank(true);
      clearInterval(intervalRef2.current);
      return val;
    }
  });


   // Start & Stop Counters 

   const startPlayCounter = (time: number = 10) => {
    setCanPlayCounter(time);
    intervalRef1.current = setInterval(decreasePlayCounter, 1000);
   }

   const startChangeCounter = (time: number = 20) => {
    setCanChangeRankCounter(time);
    intervalRef2.current = setInterval(decreaseChangeCounter, 1000);
   }

   const stopPlayCounter = () => {
    clearInterval(intervalRef1.current);
    setCanPlayCounter(0);
   }
   
   const stopChangeCounter = () => {
    clearInterval(intervalRef2.current);
    setCanChangeRankCounter(0);
   }

   // Actions Methods

   const changeRank = (event: React.MouseEvent, card: ICard) : void => {
      if(!canChangeRank) return;
      setCurrentRank(card.rank);
   }

  const makeDoubt = async (event: React.MouseEvent) => {
    stopPlayCounter();
    stopChangeCounter();
    setCanPlay(false)
    setCanDoubt(false)
    let idx = playedCards.length - 1, i;
    let round_ = -1;
    let rightGuess = false;
    let loserID = -1;
    const played = [...playedCards];
    if(played.length < 1) return;
    for(i = idx; i >= 0; i--){
       if(round_ === -1) round_ = playedCards[idx].round;
       played[i].show = true;
       played[i].zIndex = idx - i;
       setPlayedCards([...played]);
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
    await timer(2000)
    if(!rightGuess){
      loserID = Number(playerID)
    }else{
      loserID = Number(played[i-1].playerID)
    }
    const cards_ = [...cards];
    cards_[loserID] = [...cards[loserID], ...playedCards];
    setPlayedCards([])
    setCards(cards_)
    setCanDoubt(true)
    setCanPlay(true)
  }

  const playCards = (event: React.MouseEvent) : void => {
    if(currentRank === "") return;
    stopChangeCounter();
    setCanPlay(false);
    setCanChangeRank(false);
    const playedCards_ : ICard[] = []
    const playerID_ = Number(playerID);
    let allCards = cards;
    let cards_ = cards[playerID_];
    selectedCards.forEach(card =>{
      cards_ = cards_.filter(el => el.id + "_" + card.playerID !== card.id)
      const card_ = card;
      const rnd = round;
      card_.backed = true;
      card_.round = rnd;
      playedCards_.push(card_)
    })
    allCards[playerID_] = cards_;
    setPlayedCards([...playedCards, ...playedCards_])
    setCards(allCards)
    setRound(round+1);
    setSelectedCards([]);
    startPlayCounter();
    startChangeCounter();
   }

  // Render
  return(
    <div className="outer-table grid grid-rows-6 justify-items-center items-center">
      <div className = "inner-table relative flex flex-wrap row-start-2 row-end-6 table-border border-2 border-gray-800 rounded-xl artboard artboard-horizontal phone-2 bg-base-300">
      {
        cards.map((cards_: ICard[], idx: number)=>{
          return  <Player key={idx} idx={idx} selectCards={setSelectedCards} cards = {cards_} id = {String(idx)}/>
        })
      }
    </div>
    <div className = "top-[18rem] card-area relative w-[5rem] h-[7.25rem] rounded-md border-2 border-red-500 p-10 flex justify-center items-center">
        {
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
      className={`${canDoubt && playedCards.length > 0 && localStorage.getItem("p_id") !== playedCards[playedCards.length-1].playerID ? "bg-secondary hover:bg-secondary-focus" : "cursor-not-allowed bg-neutral hover:bg-neutral-focus"} border-white border-[0.1rem] text-white font-bold py-2 px-4 rounded`}
      onClick={makeDoubt} disabled={!canDoubt || playedCards.length === 0 || localStorage.getItem("p_id") === playedCards[playedCards.length-1].playerID}> أشك  </button>
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