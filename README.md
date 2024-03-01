# 鮮到家網路商店

使用 React + Bootstrap 打造的 SPA 電商系統

連結：<https://meo2326cc.github.io/fresh_delivery/>

## 為什麼做這個
自己在學完 React Hooks 時給自己的挑戰，要能夠做出市面上主流的作品，包含設計在內約兩個月完成（中間因為出國所以有再多花一些時間）

## 功能特色

- 完整的電商系統
- 自動顯示折扣
- 登入功能使用 JWT 驗證
- 10 支以上 API 串接

**客戶端：**
- 瀏覽商品
- 購物車、結帳功能
- 結帳

**後台管理：**
- 商品上架
- 公告系統
- 訂單管理


## 核心思路

### 元件安排
以`<FrontLayout/>`來作為父元件，其包含`<Nav/>`、`<Footer/>`與`<Outlet/>`，並隨著路由切換`<Outlet/>`中的元件，以`<ProductIntro/>`顯示產品的頁面來舉例，
當按下頁面的加入購物車按鈕後運作邏輯如下：

<img width="798" alt="logic" src="https://github.com/meo2326cc/fresh_delivery/assets/107049397/858c0275-a381-40a0-afc0-6310fcc97a10">


### loading 畫面與 state 處理
這是自己第一次做大型專案，其實做到後來發現一直在處理同樣的事，就是請求資料時畫面的要如何呈現來增進使用者體驗，一開始想像的流程應該會是這樣。

```flow
st=>start: 請求資料開始
loading=>operation: 載入等待畫面
cond=>condition: 是否取得資料？
success=>inputoutput: 成功，載入元件並呈現資料
failed=>inputoutput: 顯示載入失敗
e=>end: 結束

st->loading->cond
cond(yes)->success->e
cond(no)->failed->e

```

實際的架構也大概長這樣

```javascript
 
    function App () {
        const [ state, setState ] = useState( {data:[] , status:'loading'} )
        useEffect(()=>{
            try{
                const res = await axios.get('remoteData.com')
                setState({data: res , status:'success' }) 
            }catch(error){
                setState({...data , status:'failed' })
            }
        },[])

        return( { state.status=== 'loading' ? <Resault state={state} /> : <loading/> } )
    }

    function Resault ({state}) {

        const { data , status } = state

        if(status === 'success' ) {
           return // 載入成功拿到資料的元件
        }eise if ( state === 'failed' ) {
           return //  // 載入失敗的畫面
        }
    }

```

但上面的流程僅止於初次執行，

隨著開發的進行也發現除了初始狀態 loading 畫面之後還要設計各種 loading 的事件，例如在已經載入`<Resault/>`的情況下要更新畫面就不能使整個流程從頭來，還有網站 toast 效果也要一起與事件綁住，就會使流程變得複雜

像是後台管理的表單，若直接將畫面清空再顯示可能就會使使用者無法即時看到更改的項目有變化，所以就需要顯示半透明的畫面，所以使用了`useRef`來操縱元素的 class 決定畫面的顯示與否，因為不需要改變文字內容所以不需要使用到 state，也能減少畫面重新 render 的次數。

![online_store](https://github.com/meo2326cc/fresh_delivery/assets/107049397/59ae808a-ebae-4cb8-9a57-aca830d6e843)

```javascript

    function Resault () {
        
        const isLoading = useRef(null)
        const enableLoading = () => { isLoading.current.classList.remove('d-none') } // 顯示loading畫面
        const disableLoading = () => { isLoading.current.classList.add('d-none') }  //  移除loading畫面

        //元件內部操作需要重新取得資料
        const refresh = async()=>{
            enableLoading() // 函式執行開始，顯示loading畫面後，進入非同步處理
            try{
                //取得遠端資料，寫入state
                useDispatch( success ('成功') ) // 如果成功，使用useDispatch更新跨元件的toast狀態顯示成功相關通知
            }catch(error){
                useDispatch( failed (`失敗，原因：${error.message}`) ) // 如果失敗，使用useDispatch更新跨元件的toast狀態顯示失敗通知
            }finally{
                disableLoading()   //結束顯示loading畫面
            }
            
        }
        
    return( <>
        <button onClick={ refresh() } >重新整理<button/>
        <div ref={isLoading} className='d-none'>loading...<div/>
    </> )

    }
```



## 專案檢討&心得

### 跨元件資料的集中管理加強
在這個專案中麻煩的除了請求資料的畫面處理再來還有購物車與 toast 通知功能這種需要跨元件傳遞資料的功能，一開始是在做 toast 時僅使用useReducer與useContext來達成，但後來發後需要在每個頁面/元件逐一建立 useReducer 跟匯入實在過於繁瑣轉而研究使用 Redux，這樣之後在建立購物車功能時確實可以集中管理也方便不少，只不過一開始的思路僅在於使用 Redux 來傳遞資料並沒有想到需要集中管理，像是購物車功能最大的缺點是更新資料的 function 是分別寫在不同的元件，只要該元件有這項功能就會有這樣的 function，除了不知道 RTK Query 可以用 middleware 來達到中央統一請求資料，也是事先缺乏規劃的原因，但現在也了解在做這樣的服務或功能需要注意的地方。

### 元件拆分
頁面一多時如果需要統一樣式時雖然使用 Bootstrap 或 Tailwind 等 CSS 框架是快速也不用煩惱 CSS 規則的好選擇，但還是會煩惱要讓自組元件各個 utli 保持統一，程式碼好像也會變得很不易維護，也是這個契機讓我想要研究 UI 框架，期望能快速的開發好看的介面

### 網站效能
網頁圖片的處理上是直接以連結帶入 Unsplash 的圖片，然而後續在觀察頁面載入時會花非常久的時間，後續要先壓縮圖片避免直接使用原尺寸圖片
