import { useState } from "react";
import { PageTemplate } from "./ClientComponent";
import { useNavigate } from "react-router";


export default function SearchOrder() {

const [ input , setInput ] = useState()
const navigateToOrder =  useNavigate()

function submit(){
    navigateToOrder('/orderConfirm/' + input )
}
  return (
    <PageTemplate title={"訂單查詢"}>
      <div>
        <p>請輸入訂單編號（包含 - ）</p>
        <div className="input-group mb-3 py-5">
          <input
            type="text"
            className="form-control"
            placeholder="範例：-xxxxxxxxxxxxxxxxxxx"
            onChange={(e)=>{ setInput(e.target.value) }}
          />
          <button
            className="btn btn-primary"
            type="button"
            id="button-addon2"
            onClick={submit}>
             送出 </button>
        </div>
      </div>
    </PageTemplate>
  );
}
