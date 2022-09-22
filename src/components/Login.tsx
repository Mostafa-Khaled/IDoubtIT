import React, { ChangeEvent, FormEvent } from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
interface IProps{
    loginUser:  React.Dispatch<React.SetStateAction<string>>
}

const Login : React.FC<IProps> = (props : IProps) => { 
  const navigate = useNavigate();         
  const [mail, setMail] = useState<string>(""); 
  const [pass, setPass] = useState<string>(""); 
  const [isLogged, setLogged] = useState<boolean>(localStorage.getItem("__ID") != undefined);
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
    fetch('/api/users/login',{
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        email : mail,
        password : pass
      })
    }).then(res => res.json()).then(res =>{
        if(res._id){
            localStorage.setItem("__ID", res._id);
            props.loginUser(res._id);
            setLogged(true);
            navigate('/');
        }
    }).catch(err => {
        console.log(err);
    })
  }
  useEffect(()=>{
    if(isLogged) navigate("/");
  },[])
  return (
    <div className={isLogged ? "hidden" : ""}>
        {/* <Navbar isLogged = { isLogged } logout={ setLogged }/> */}
        <h1 className="text-3xl font-bold max-w-xl mx-auto text-center m-t-2 p-2"> Login </h1>
        <div className="container max-w-xl mx-auto flex justfiy-center my-5 border border-gray-500 p-10 rounded-md">
            <form className="w-full max-w-lg" action="POST" onSubmit={(e)=>{onSubmit(e)}}>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                    Email
                </label>
                <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email" type="email" placeholder="mail@domain.com" onChange={handleEmail}/>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                    Password
                </label>
                <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************" onChange={handlePassword}/>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3">
                    <input required className="appearance-none block w-full bg-teal-500 text-white border border-teal-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none hover:bg-teal-600 hover:border-teal-700 transition-all" id="grid-submit" type="submit" value="Login"/>
                </div>
            </div>
            </form>
        </div>
    </div>
  )
}

export default Login