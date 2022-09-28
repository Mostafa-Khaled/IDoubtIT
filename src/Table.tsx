import React from 'react'
import Card, { ICard, Type } from './Card'
import Player from './Player'
import { useState, useEffect } from 'react'

interface IProps{

}
const Table = (props: IProps) => {


  // Kinds Chooser 
  const playerID = localStorage.getItem("p_id");
  const allRanks= ["A","2","3","4","5","6","7","8","9","10","K","Q","J"];
  const ranks : ICard[] = [];
  allRanks.forEach(rank => {
    const card : ICard = {
    kind: "S",
    rank: rank,
    position : { x: 0, y: 0 },
    backed: false,
    type: Type.Player,
    id: rank+"-S",
    selected: false
   }
   ranks.push(card);
  })

  // Dummy Example 
   const createCard = (rank: string, kind: string) : ICard => {
      const card : ICard = {
      kind: kind,
      rank: rank,
      position : { x: 0, y: 0 },
      backed: false,
      type: Type.Player,
      id: "",
      selected: false,
      show: false
     }
     card.id = card.rank+"-"+card.kind;
     return card;
   } 
   const [cards, setCards] = useState<any>([[]]);

   useEffect(()=>{
    const cards_ : any = [];
    const kinds : string[] = ["S","H","D","C"]
    for(let i = 0; i < 4; i++){
      const row : ICard[] = [];
      for(let j = 0; j < 13; j++){
        row.push(createCard(allRanks[j],kinds[i]));
      }
      cards_.push(row);
    }
    setCards(cards_);
   },[]) 

   // States   

   const [playedCards, setPlayedCards] = useState<ICard[]>([]);
   const [selectedCards, setSelectedCards] = useState<ICard[]>([]);
   const [currentRank, setCurrentRank] = useState<string>("");
   const [canPlay, setCanPlay] = useState<boolean>(true);
   const [canChangeRank, setCanChangeRank] = useState<boolean>(true);
   const [round, setRound] = useState<number>(0)
   const [canPlayCounter, setCanPlayCounter] = useState<number>(0)
   const [canChangeRankCounter, setCanChangeRankCounter] = useState<number>(0)
   const [stopCounter, setStopCounter] = useState<boolean[]>([false, false])

   // Methods 
   const timer = ms => new Promise(res => setTimeout(res, ms))

   const countDownPlay = async (time: number = 10) => {
      setStopCounter([false, stopCounter[1]]);
      for(let i = time; i > 0; i--){
        setCanPlayCounter(i);
        await timer(1000);
        if(stopCounter[0]) break;
      }
      setCanPlay(true);
      setCanPlayCounter(0)
   } 

   const countDownChange = async (playedCards_: ICard[], time: number = 20) => {
    setStopCounter([stopCounter[0], false]);
      for(let i = time; i > 0; i--){
        setCanChangeRankCounter(i);
        await timer(1000);
        if(stopCounter[1]) break;
        console.log(stopCounter)
      }
      setCanChangeRank(playerID === playedCards_[playedCards_.length - 1].playerID);
      setCanChangeRankCounter(0)
   } 

   const changeRank = (event: React.MouseEvent, card: ICard) : void => {
      if(!canChangeRank) return;
      setCurrentRank(card.rank);
   }

  const makeDoubt = async (event: React.MouseEvent) => {
    setStopCounter([true, true])
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
  }

  const playCards = (event: React.MouseEvent) : void => {
    setStopCounter([true, true]);
    if(currentRank === "") return;
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
    countDownPlay();
    countDownChange([...playedCards, ...playedCards_]);
   }

  // Render
  return(
    <div className="outer-table grid grid-rows-6 justify-items-center items-center">
      <div className = "ranks grid row-start-1 row-end-3">
        {
          ranks.map((card: ICard, idx: number) => {
            return <div key={card.id} className={`rank-card ${card.rank === currentRank ? "chosen" : ""}`} onClick={(e)=>changeRank(e, card)}> 
              <Card id={card.id} rank={card.rank} position={card.position} backed={card.backed} type={card.type} kind={card.kind} selected={card.selected}/> 
              </div>
            })
        }
      </div>
      <div className = "inner-table flex flex-wrap row-start-3 row-end-6 table-border border-2 border-gray-800 rounded-xl w-[60vw] h-[60vh] bg-gray-900">
      {
        cards.map((cards_: ICard[], idx: number)=>{
          return  <Player selectCards={setSelectedCards} cards = {cards_} id = {String(idx)}/>
        })
      }
      <div className = "card-area relative w-[5rem] h-[7.25rem] rounded-md border-2 border-red-500 p-10 flex justify-center items-center">
        {
          playedCards.map((card: ICard, idx: number)=>{
            return <div key={card.id+card.show} className='played-card absolute w-[84%] h-[84%] top-[7%] left-[9%]'> 
            <Card id={card.id} rank={card.rank} position={card.position} backed={card.backed} type={card.type} kind={card.kind} zIndex={card.zIndex} show={card.show} selected={card.selected}/> 
            </div>
          })
        }
      </div>
      <div className="player-actions">
        <button 
        className={`${canPlay && selectedCards.length > 0 ? "bg-blue-500 hover:bg-blue-700" : "cursor-not-allowed bg-gray-500 hover:bg-gray-700"} text-white font-bold py-2 px-4 rounded m-3`}
        onClick={playCards} disabled={!canPlay || selectedCards.length === 0}> العب </button>
        <button 
        className={`${playedCards.length > 0 && playerID !== playedCards[playedCards.length-1].playerID ? "bg-blue-500 hover:bg-blue-700" : "cursor-not-allowed bg-gray-500 hover:bg-gray-700"} text-white font-bold py-2 px-4 rounded`}
        onClick={makeDoubt} disabled={playedCards.length > 0 && playerID === playedCards[playedCards.length-1].playerID}> أشك  </button>
        <span className="counter text-white font-bold py-2 px-4 rounded m-3"> {canPlayCounter} </span>
        <span className="counter text-white font-bold py-2 px-4 rounded m-3"> {canChangeRankCounter} </span>
      </div>
    </div>
    </div>
  )
}


export default Table 