export default function Pending() {
    return (<div className=" opacity-background position-absolute h-100 w-100 d-flex justify-content-center align-items-center">
        <span className="material-icons pending">refresh</span>
        <p className="fs-4 fs-bolder"> 載入中...</p>
    </div>)
}