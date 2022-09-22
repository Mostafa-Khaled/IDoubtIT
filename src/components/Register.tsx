import React, { ChangeEvent, FormEvent } from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
interface IProps{
  isLogged : boolean
}

const Register : React.FC<IProps> = (props : IProps) => {
  const navigate = useNavigate();   
  const [fname, setFName] = useState<string>(""); 
  const [lname, setLName] = useState<string>(""); 
  const [mail, setMail] = useState<string>(""); 
  const [pass, setPass] = useState<string>(""); 
  const handleFirstName = (event : ChangeEvent<HTMLInputElement>) : void => {
    event.preventDefault();
    setFName(event.target.value);
  }
  const handleLastName = (event : ChangeEvent<HTMLInputElement>) : void => {
    event.preventDefault();
    setLName(event.target.value);
  }
  const handleEmail = (event : ChangeEvent<HTMLInputElement>) : void => {
    event.preventDefault();
    setMail(event.target.value);
  }
  const handlePassword = (event : ChangeEvent<HTMLInputElement>) : void => {
    event.preventDefault();
    setPass((event.target as HTMLInputElement).value);
  }
  const onSubmit = (event : FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch('/api/users/register',{
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        name : fname + " " + lname,
        email : mail,
        password : pass
      })
    }).then(()=>{
      navigate("/")
    })
  }
  useEffect(()=>{
    if(props.isLogged) navigate("/");
  },[])
  return (
    <div className={props.isLogged ? "hidden" : ""}>
        <h1 className="text-3xl font-bold max-w-xl mx-auto text-center m-t-2 p-2"> Register </h1>
        <div className="container max-w-xl mx-auto flex justfiy-center my-5 border border-gray-500 p-10 rounded-md">
            <form className="w-full max-w-lg" action="POST" onSubmit={(e)=>{onSubmit(e)}}>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                    First Name
                </label>
                <input required className={"appearance-none block w-ful text-gray-700 bg-gray-200 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"}  id="grid-first-name" type="text" placeholder="Jane" onChange={handleFirstName}/>
                {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                </div>
                <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                    Last Name
                </label>
                <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" onChange={handleLastName} />
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                    Email
                </label>
                <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email" type="email" placeholder="mail@domain.com" onChange={handleEmail}/>
                <p className="text-gray-600 text-xs italic">Please use a valid email</p>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                    Password
                </label>
                <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************" onChange={handlePassword}/>
                <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3">
                    <input required className="appearance-none block w-full bg-red-500 text-white border border-red-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none hover:bg-red-600 hover:border-red-700 transition-all" id="grid-submit" type="submit" value="Submit"/>
                </div>
            </div>
            </form>
        </div>
    </div>
  )
}

export default Register