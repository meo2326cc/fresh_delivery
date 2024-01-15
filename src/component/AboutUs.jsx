import { PageTemplate } from "./ClientComponent"
import logo from '../img/footer-logo.png'

export default function AboutUs(){
    return (
        <PageTemplate title={'品牌理念'}>
            <div className="mw-600px me-auto mt-5">
                <img src={logo} width='200' alt="freshdelivery" />
                <p className="mt-5">鮮到家創立於2023年，因為疫情而意識到食物外送與網路電商蓬勃發展的而創立，希望可以以方便、新鮮的形式將好吃的家常菜直接送到消費者手中，
                目的是讓消費者透過網路直接預訂接下來數日的餐食，專為忙碌的現代人打造。</p>
            </div>
        </PageTemplate>
    )
}