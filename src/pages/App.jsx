import axios from "axios"
import { useState } from "react";
import { Link } from "react-router-dom"


let data ;
let currencyJPY = 0;
const getData = async()=>{
  const res =  await axios({url:'/capi.php',responseType:'json',method:'get'})
  
data = res.data
}

(async()=>{
  await new Promise(resolve => {
    resolve(getData())
  })
  currencyJPY = data?.USDTWD.Exrate / data?.USDJPY.Exrate;
})()



function App() {
const [text, setText] = useState(0)

function clac(e){
  if(e.target.value!==''){
         setText(Number(e.target.value)) 
  }

}


  return (
    <>
  <h1> 算日幣OMG</h1>
    <input type="text" onChange={clac} />
    <br/>
    <p>{ (text*currencyJPY).toFixed(2) }TWD</p>
    <Link to='/login'>登入</Link>
    </>
  )
}

export default App
