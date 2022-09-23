import React from 'react'
import Card from './Card'
import { useState, useEffect } from 'react'

interface IProps{

}

interface Position{
  x: number,
  y: number
}

interface ICard{
  kind: string,
  rank: string,
  id: string,
  position: Position,
  currPosition: Position,
  backed: boolean,
  color: string
}

const Deck = (props: IProps) => {
  const [active, setActive] = useState<number>(-1);
  const [deck, setDeck] = useState<ICard[]>([]);
  const handleClick = (event : React.MouseEvent, idx: number) : void => {
    const deckClone : ICard[] = [...deck];
    const shiftVal = -40;
    if(active >= 0 && active < deck.length){
      deckClone[active].currPosition.y -= shiftVal;
    } 
    if(active !== idx){
      deckClone[idx].currPosition.y += shiftVal
    }
    setActive(active === idx ? -1 : idx)
    setDeck(deckClone)
  }
  const handDoubleClick = (event : React.MouseEvent, idx: number) : void =>{
    const deckClone : ICard[] = [...deck];
    if(idx >= 0 && idx < deck.length){
      deckClone[idx].backed = !deckClone[idx].backed
    } 
    setDeck(deckClone)
  }
  const shuffleDeck = () : void => {
    const len = deck.length
    const arr : number[] = []
    const topDeck : number[] = []
    const botDeck : number[] = []
    for(let i = 0; i < len; i++) arr.push(i);

  }
  useEffect(()=>{
    const arr = [];
    const kinds: string[] = ["heart", "club", "diamond", "spade"]
    const ranks: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "king", "jack", "queen"]
    for(let i = 0; i < 30; i++){
      const card: ICard = {
        kind: kinds[~~(Math.random() * kinds.length)],
        rank: ranks[~~(Math.random() * ranks.length)],
        position:{
          x: 50+i*15,
          y: 50
        },
        currPosition: {
          x: 50+i*15,
          y: 50
        },
        id: '',
        backed: true,
        color: "black"
      }
      card.id = !card.backed ? `${card.kind}_${card.rank}_${i}` : `back_${i}`
      arr.push(card);
    }
    setDeck(arr);
  },[])
  return (
    <div>
      <div className='hidden'>
      { 
          deck.map( (card: ICard) => 
          <Card id={card.id} backed={card.backed} color={card.color}
          position={deck[0].position} currPosition={card.currPosition}
           kind={card.kind} rank={card.rank} /> )
      }
      </div>
      <svg width="600" height="700">
      {
          deck.map((card: ICard, idx: number)=>
          <use xlinkHref={`#${card.id}`} onClick={e=>handleClick(e, idx)}
          onDoubleClick={e=>handDoubleClick(e, idx)}
          style={{"transform": `rotateX(70deg) rotateY(0deg) rotateZ(-20deg) translateZ(-${200-idx*3}px) ${(active === idx ? "translateY(50px)" : "")}`}}
          className={"transition-all duration-500	ease-in-out "}/>
         )
      }
      </svg>
    </div>
  )
}

export default Deck