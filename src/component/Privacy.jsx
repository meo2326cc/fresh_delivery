import { PageTemplate } from "./ClientComponent"

export default function Privacy(){
    return (
        <PageTemplate title={'隱私權政策(此為範本)'}>
            <div className="mw-600px me-auto">
                <h3 className="mt-5">一、個人資料取得</h3>
                    <p>鮮到家有限公司針對消費者與個人資料之蒐集及運用，依據中華民國個人資料保護法及本隱私權政策蒐集處理及利用您的個人資料。</p>
                    <p>鮮到家有限公司將蒐集您下列個人資料以提供服務：</p>
                    <ul className="ms-3">
                        <li>姓名</li>
                        <li>電話</li>
                        <li>電子郵件</li>
                        <li>地址</li>
                    </ul>
                <h3 className="mt-5">二、個人資料使用</h3>
                <p>上述個人資料將使用於核對與確認訂購人、用於商品運送與付款金流，除此之外鮮到家不會將使用者個人基本資料提供給第三方。</p>
            </div>
            <div className="mt-5">
                <p className="fs-3 text-danger">上述內容僅供網站練習使用，並非真正的隱私權公告，操作本網站時之個人資料欄位將傳至六角學院所提供之API，請勿留下個人真實料(姓名、電話、電子郵件、地址)</p>
            </div>
        </PageTemplate>
    )
}