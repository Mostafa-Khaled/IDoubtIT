import React, {useEffect, useState} from 'react'

import { useParams, useNavigate } from 'react-router-dom'
 
import { doc, getDoc, onSnapshot } from 'firebase/firestore' 

import { useDocumentData } from 'react-firebase-hooks/firestore'

import { IPlayerData } from '../functions/interfaces'

import db from '../firebase/methods' 

import Table from './Table'
import NotFound from './NotFound'

interface IProps{

}

const Waiting = (props: IProps) => {

  const navigate = useNavigate();
  const {id : roomID} = useParams()
  //const [userNames, setUserNames] = useState<Record<string, IPlayerData>[]>([]);

  const docRef = doc(db, "doubt", roomID);

  const [userNames, loading, error] = useDocumentData(docRef);

  useEffect(()=>{
    //console.log(userNames, loading, error);
  },[userNames])

  return (
    <>
      { !loading && !userNames && <NotFound type="Room" />}
      { !loading && userNames && userNames.players.length === 4 && <Table roomID={roomID}/> }
      { !loading && userNames && userNames.players.length !== 4 && <div className="overflow-x-auto w-[50%] flex justify-center items-center">
      <table className="table w-[50%]">
        <thead>
          <tr>
            { !loading && 
              <th> { userNames.players.length } out of 4 Players ... </th>
            }
          </tr>
        </thead>
        <tbody>
          {
            !loading && userNames.players.map((user : Record<string, IPlayerData>, idx) => {
              const playerID = user[Object.keys(user)[0]];
              const playerName = playerID.name;
              return <tr key={idx}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                        <span>{playerName[0].toUpperCase()}</span>
                      </div>
                    </div> 
                    <div>
                      <div className="font-bold">{playerName}</div>
                    </div>
                  </div>
                </td>
              </tr>
            })
          }
        </tbody>
      </table>
    </div> }
    </>
  )
}

export default Waiting