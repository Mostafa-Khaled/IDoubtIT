import React, { Component } from 'react'

interface IProps{
    s1 : string,
    s2 : string,
    s3 : string
}

class Machine extends Component<IProps, {}>{
  render() : React.ReactNode{
    let strs : string[] = [];
    for(let prop in this.props){
      strs.push(this.props[prop]);
    }
    return (
      <div className="flex flex-wrap flex-row text-white bg-indigo-500">
        {strs.map((element : string, idx : number) => {
        return <p key = {idx} className="bg-indigo-700 py-1 px-3 m-2 rounded-md"> {element} </p>
        })}
        <p className='bg-sky-700 py-1 px-3 m-2 rounded-md'>
          {(strs[0] == strs[1] && strs[1] == strs[2]) ? "Wins" : "Lose"} 
        </p>
      </div>
    )
  }
}

export default Machine