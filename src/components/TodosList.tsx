import React from 'react'
import { Todo } from './Todos'
interface IProps{
    todos : Todo[]
    handleDelete : Function
}

const TodosList = (props : IProps) => {
  return (
    <ul className='flex flex-row flex-wrap bg-gray-800 p-5'>
    { props.todos.map( todo => 
        <li 
        key = {todo.id} 
        className = { "flex flex-row text-white p-4 m-3 rounded-lg shadow-lg shadow-gray-900 capitalize font-sans basis-11/12 " + (todo.completed ? "bg-green-700 hover:bg-green-800" : "bg-red-700 hover:bg-red-800") }
        > 
            <p className = "basis-11/12"> { todo.title } </p>
            <p className = "basis-1/12 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 cursor-pointer" onClick = {() => props.handleDelete(todo.id)}>
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
            </p>
        </li> ) }
    </ul>
  )
}

export default TodosList