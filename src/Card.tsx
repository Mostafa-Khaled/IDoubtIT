//import { eventNames } from 'process'
import React from 'react'
import Icons from './test.svg'
import {useEffect, useState} from 'react'

//import { useState } from 'react'

function importAll(r) {
  let images = {};
  r.keys().map(item => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./Cards', false, /\.(png|svg)$/));

interface Position{
  x: number,
  y: number
}

interface IProps{
  id: string
  kind: string,
  rank: string,
  position: Position,
  backed: boolean,
  currPosition: Position
  style_: object
  active: number
  idx: number
  classNames: string,
  animation: string,
  clickHandle: (event: React.MouseEvent, idx: number) => void
  dbHandle: (event: React.MouseEvent, idx: number) => void
}

const Card = (props: IProps) => {
  const [style_, setStyle] = useState<object>(
    { ...props.style_, "transform" : `rotateX(70deg) rotateY(0deg) rotateZ(-20deg) translateZ(-${200-props.idx*3}px)` }
  );
  const [zIdx, setIdx] = useState<number>(props.idx);
  useEffect(() => {
    const transActive = `rotateX(70deg) rotateY(0deg) rotateZ(-20deg) translateZ(-${200-props.idx*3}px) ${(props.active === props.idx ? "translateY(50px)" : "")}`;
    setStyle({...props.style_, "transform" : props.animation === "" ? transActive : props.animation});
  },[props.active, props.animation])
  useEffect(()=>{
    setIdx(props.idx);
  },[props.idx])
  return (
      /*<svg className={`icon icon-back`} width={"600"} height={"400"}>
        <g id={props.id}>
          <use fill={props.color || "black"} xlinkHref={!props.backed ? `${Icons}#${props.kind}_${props.rank}` : `${Icons}#back`} 
          x={props.position.x} y={props.position.y}/>
        </g>
      </svg>*/
      <div className="outer" style={{"top": "50px", "left":"50px", "zIndex" : zIdx}}>
        <div  className="inner relative"
              onClick={(e) => props.clickHandle(e, props.idx)} 
              onDoubleClick={(e) => props.dbHandle(e, props.idx)}>
          <div className="back absolute">
          <img className={props.classNames} style={style_} 
          src={images[`${props.rank}-${props.kind}.png`]}/>
          </div>
          <div className="front absolute">
          <img className={props.classNames} style={style_} src={images["BACK.png"]}/>
          </div>
        </div>
      </div>    
  )
}

export default Card