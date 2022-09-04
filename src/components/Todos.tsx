import React, { useState, useEffect } from 'react'
import TodosList from './TodosList'
 
interface Todo{
  id: number,
  userId: number,
  title: string,
  completed: boolean
}

const todoEmpty : Todo[] = [] as Todo[];
const Todos = () => {

  const [todos, setTodos] = useState(todoEmpty);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  let initLength = -1;
  useEffect(() => {
    setTimeout( () => {
      fetch('api').then(res => {
        console.log(res);
        if( !res.ok ){
          throw Error("Problem with fetching");
        }
        return res.json()
      }).then(res => {
        setTodos(res);
        setDone(true);
      }).catch( (err : Error) => {
        setError(err.message);
      })
    } , 1000)
  },[])

  useEffect(() => {
    if(todos.length !== initLength && todos.length > 0){
      fetch('api', {
        method : "POST",
        mode : "cors",
        headers : {
          "Content-Type" : 'application/json'
        },
        body : JSON.stringify(todos)
      })
    }
  },[todos])

  const handleDelete = (todoID : number) : void => {
    setTodos( todos.filter( todo => todo.id != todoID ) );
  }

  return (
    <div>
      { !done && error === "" && <p className = "w-100 p-3 bg-gray-800 text-white"> Loading... </p> }
      { error !== "" &&  <p className = "w-100 flex justify-center m-3 p-3 bg-red-600 text-white"> {error} </p> }
      { done && <TodosList todos = {todos} handleDelete = { handleDelete } /> }
    </div>
  )
}
export default Todos
export { Todo }