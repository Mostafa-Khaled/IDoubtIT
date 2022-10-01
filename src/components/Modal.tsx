import React, { useEffect, useState, useRef } from 'react'

interface IProps{
  msg: string,
  msgs: Record<string, string>
  rtl?: boolean
}

const Modal = (props: IProps) => {
  const error = useRef<HTMLAnchorElement>()
  const [errorMsg, setErrorMsg] = useState<string>("");
  useEffect(() => {
    if(props.msg !== ""){
      setErrorMsg(prev => props.msg)
      error.current.click()
    }
  },[props.msg])
  return (
    <>
      <a ref={error} href="#alert" className="btn hidden">open modal</a>
      <div className="modal" style={{"direction":`${props.rtl ? "rtl" : "ltr"}`}} id="alert">
        <div className="modal-box">
          <p className="py-4"> { errorMsg } </p>
          <div className="modal-action">
           <a href="#" className="btn btn-error shadow-xl" onClick={()=>setErrorMsg(prev => "")}>{props.msgs.close}</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal