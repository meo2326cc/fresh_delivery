import axios from "axios";
import { useState ,useRef, useEffect } from "react";
import { useNavigate } from "react-router";


export function Login() {
    const btnStatus = useRef(null)
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', password: '' })
    const [loginFail , isLoginFail] = useState ({status:false , errorMsg:''});

    function handleInput(e) {
        switch (e.target.name) {
            case 'username': return setForm({ ...form, username: e.target.value });
            case 'password': return setForm({ ...form, password: e.target.value });
            default: break
        }
    }

    async function submitForm(e) {
        e.preventDefault();
        btnStatus.current.classList.add('disabled');
        try {
            const res = await axios.post(import.meta.env.VITE_PATH_ADMIN_SIGNIN, form)
            const { expired, token } = res.data
            document.cookie = `hexToken=${token}; expires=${new Date(expired)}`
            navigate('/admindashboard/products')

        } catch (error) {
            console.log(error)
            isLoginFail({status:true , errorMsg:error.response?.data.message === undefined ? '請檢查網路連線' : error.response.data.message })
        }
    }


    btnStatus.current?.classList.remove('disabled');

    useEffect(()=>{
        const token = document.cookie.split(';').find((row) => row.startsWith('hexToken='))?.split('=')[1];
        axios.defaults.headers.common['Authorization'] = token;
        // if (token !== undefined ) {
        //     return navigate('/admindashboard/products')
        // }
    },[])
    
    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
            <div className="col-md-8 col-lg-4 col-12 rounded-3  border p-5">
            <h2>登入</h2>
            {loginFail.status && <div className="alert alert-danger" role="alert">
                {loginFail.errorMsg}
            </div>}
            <form onSubmit={submitForm}>
                <div className="mb-3">
                <label htmlFor="username">使用者名稱</label>
                <input className="form-control" placeholder="example@mail.com" type="text" id="username" name="username" onChange={handleInput} />                    
                </div>
                <div className="mb-3">
                <label htmlFor="password">密碼</label>
                <input className="form-control" placeholder="password" type="password" id="password" name="password" onChange={handleInput} />                    
                </div>
                <button ref={btnStatus} className="btn btn-primary" type="submit">登入</button>
            </form>                
            </div>
        </div>
    )
}

