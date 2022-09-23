//import { eventNames } from 'process'
import React from 'react'
import Icons from './test.svg'
//import { useState } from 'react'

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
  color?: string
}

const Card = (props: IProps) => {
  return (
      <svg className={`icon icon-back`} width={"600"} height={"400"}>
        <g id={props.id}>
          <use fill={props.color || "black"} xlinkHref={!props.backed ? `${Icons}#${props.kind}_${props.rank}` : `${Icons}#back`} 
          x={props.position.x} y={props.position.y}/>
        </g>
      </svg>
  )
}

export default Card