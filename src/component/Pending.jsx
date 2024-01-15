export default function FormLoading( {isLoading} ) {
    return (
    <tbody className=" opacity-background-gray position-absolute h-100 w-100 d-none" ref={isLoading}>
        <tr></tr>
        <tr className=" d-flex justify-content-center align-items-center h-100">
            <td className="d-flex align-items-center border-0 bg-unset">
                <span className="material-icons pending">refresh</span>
                <p className="fs-4 fs-bolder"> 載入中...</p>
            </td>
        </tr>
    </tbody>)
}