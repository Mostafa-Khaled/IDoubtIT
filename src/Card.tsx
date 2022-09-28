import React from 'react'
import {useEffect, useState} from 'react'
function importAll(r) {
  let images = {};
  r.keys().forEach(item => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./Cards', false, /\.(png|svg)$/));

enum Type{
  Deck,
  Player,
  Table_Played,
  Table_Revealed
}

interface IPosition{
  x: number,
  y: number
}

interface ICard{
  id: string
  kind: string,
  rank: string,
  position: IPosition,
  backed: boolean,
  type: Type,
  selected: boolean,
  round?: number,
  playerID?: string
  show?: boolean
  zIndex?: number
}

interface IProps extends ICard{
}

const Card = (props: IProps) => {
  const [show, setShow] = useState<boolean>(false);
  useEffect(()=>{
    setShow(props.show);
  },[props.show])
  const imgSrc = props.rank + '-' + props.kind[0] + '.png'
  const img = props.backed ? images["BACK.png"] : images[imgSrc]
  const imgInv = !props.backed ? images["BACK.png"] : images[imgSrc]
  return (
      <div style={{"zIndex" : props.zIndex || 0}} className = {`card m-0 relative ${show ? "show": ""} ${props.selected ? '-translate-y-2' : ''}`}> 
        <div className = "front m-0"> 
          <img className="w-full h-full" alt="card" src={img} />
        </div>
        <div className = "back m-0 absolute top-0 left-0 w-full h-full rotate-y-180 opacity-0">
          <img className="w-full h-full" alt="card" src={imgInv} />
        </div>
      </div>
  )
}

export default Card

export { ICard, Type } 