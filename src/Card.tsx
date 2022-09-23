//import { eventNames } from 'process'
import React from 'react'
import Icons from './test.svg'

//import { useState } from 'react'

function importAll(r) {
  let images = {};
  console.log(r)
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
  style_: Object
  color?: string
  idx: number
  classNames: string,
  clickHandle: (event: React.MouseEvent, idx: number) => void
  dbHandle: (event: React.MouseEvent, idx: number) => void
}

const Card = (props: IProps) => {
  return (
      /*<svg className={`icon icon-back`} width={"600"} height={"400"}>
        <g id={props.id}>
          <use fill={props.color || "black"} xlinkHref={!props.backed ? `${Icons}#${props.kind}_${props.rank}` : `${Icons}#back`} 
          x={props.position.x} y={props.position.y}/>
        </g>
      </svg>*/
      <img onClick={(e) => props.clickHandle(e, props.idx)} 
      onDoubleClick={(e) => props.dbHandle(e, props.idx)}
      className={props.classNames} style={props.style_} src={props.backed ? images["BACK.png"] : images[`${props.rank}-${props.kind}.png`]}/>
  )
}

export default Card