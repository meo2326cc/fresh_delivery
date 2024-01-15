import { PageTemplate } from "./ClientComponent"
import { Link } from "react-router-dom"

export default function Delivery(){
    return (
        <PageTemplate title={'物流相關'}>
            <div className="mw-600px me-auto">
            <p className="mt-5">
                本商城皆以宅配方式配送，運用成本已包含至售價故不加收運費，訂單需要經過付款才會開始出貨，您可從電子郵件或
                <Link className="btn-link text-decoration-underline" to='/orderconfirm'>訂單查詢</Link>查詢您的訂單狀態，訂單出貨後後約2日內可收到商品，物流配送時間為週一至週五：配送09時至19時，若有相關問題歡迎來信cccsmp@gmail.com
            </p>
            <p className="mt-5">
                備註：  </p>
                <ul className="ms-3">
                    <li>若超過當日中午12:00下單將會延後至下個工作天出貨</li>
                    <li>如遇不可抗力之因素，將視狀況處理並於官網公告。</li>
                </ul>
            </div>

        </PageTemplate>
    )
}