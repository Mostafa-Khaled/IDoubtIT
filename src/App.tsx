import React from 'react';
import './App.css';
import './index.css';
import { useState, useEffect } from 'react'

const App : React.FC = () => {

  interface User{
    id : number,
    message : string,
    firstName : string,
    lastName : string
  }

  const user : User[] = [{ 
    id : 0,
    message : "",
    firstName : "No",
    lastName : "One" 
  }];

  const [ backData, setBackData ] = useState<User[]>(user);
  const [ pathURL, setPathURL ] = useState<string>("");
  const [ currentUser, setCurrentUser ] = useState<User>(user[0]);

  function deleteUser( id : number ) : void{
    setBackData(backData.filter( (user : User) => user.id !== id ));
    console.log(backData);
    fetch('/api', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backData)
    }).then( res => {
      console.log("Deleted!!");
      fetchBack('api');
    });
  }

  function fetchBack( path : string ){
    fetch(path).then( res => res.json() )
    .then( res => { 
      setBackData(res) 
    }).catch( error => {
      let msg2 : User = Object.assign({} as User, ...user);
      msg2.message = "Fuck no data!!!";
      setBackData([msg2]);
    });
  }

  function createNewUser( data : string, field : string ) : void {
    let newUser : User = currentUser;
    newUser[field] = data;
    newUser["id"] = backData[backData.length - 1]["id"] + 1;
    setCurrentUser(newUser);
  }

  function addNewUser( user : User ) : void {
     let found : boolean = false;
     let newUser : User = Object.assign({} as User, user);
     backData.forEach( (msg : User) => {
      if(newUser.message === msg.message){ 
        found = true;
       }
     });
     if(!found){
      fetch('/api', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...backData, newUser])
      }).then( res => {
        console.log("fetched!!");
        fetchBack('api');
      });
     }
  }

  return (
    <div className="container mx-auto my-2 bg-gray-900 px-2 py-4 text-white rounded-md">
      { backData.map( ( user : User ) => 
      <div onContextMenu={()=>deleteUser(user.id)} 
      className = "text-white px-2 py-2 bg-gray-800 m-5 rounded-md border-2 border-sky-500/50" 
      key={user.id}> {user.firstName} {user.lastName} : {user.message} </div> ) 
      }
      <form className = "flex flex-row my-4" onSubmit = { e => { e.preventDefault(); fetchBack(pathURL) } }>
        <input className = "mx-5 p-3 text-white-500 bg-transparent border-sky-500/60 border-2 rounded-md" value = {pathURL} onChange = { e => setPathURL(e.target.value) }/>
        <input className = "bg-red-500 px-4 rounded-md border-2 border-orange-500/50 hover:bg-red-600 transition-all transition-duartion-500" 
        type="submit" value = "Get"/>
      </form>
      <form className = "flex flex-row my-4" onSubmit = { e => { e.preventDefault(); addNewUser(currentUser) } }>
        <input className = "mx-5 p-3 text-white-500 bg-transparent border-sky-500/60 border-2 rounded-md"  onChange = { e => createNewUser(e.target.value, "firstName") }/>
        <input className = "mx-5 p-3 text-white-500 bg-transparent border-sky-500/60 border-2 rounded-md"  onChange = { e => createNewUser(e.target.value, "lastName") }/>
        <input className = "mx-5 p-3 text-white-500 bg-transparent border-sky-500/60 border-2 rounded-md"  onChange = { e => createNewUser(e.target.value, "message") }/>
        <input className = "bg-red-500 px-4 rounded-md border-2 border-orange-500/50 hover:bg-red-600 transition-all transition-duartion-500" 
        type="submit" value = "Add"/>
      </form>
    </div>
  );
}


export default App;
