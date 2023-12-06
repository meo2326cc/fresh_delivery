import {  useEffect, useRef,  } from "react" 
import { useSelector } from "react-redux"


export default function Toast () {

  const toastController = useRef(null)
  const notificationState = useSelector((state)=>{
    return state.toast
  })

  useEffect(()=>{

      if(notificationState.message !== '' ){
        //toastController.current.classList.add(notificationState.bgcolor)
        toastController.current.classList.add('show')
      }
      toastController.current.classList.remove('showing')   
    setTimeout(()=>{
      toastController.current.classList.add('showing')
      return setTimeout(()=>{toastController.current.classList.remove('show')},500)
    },1500)


  },[notificationState])

    return(
        <div ref={toastController} className={`toast py-2 align-items-center text-white position-fixed border-0 z-index-10000 fade ${notificationState.bgColor}`} role="alert" aria-live="assertive" aria-atomic="true" >
  <div className="d-flex">
    <div className="toast-body">
      {notificationState.message}
    </div>
  </div>
</div>
    )
}