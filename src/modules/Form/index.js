import Input from "../../components/Input";
import Button from "../../components/Button";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


const Form = ({
    isSignInPage = true,
}) => {
    const [data, setData] = useState({
        ...(!isSignInPage &&{
            fullName: ''
        }),
        email: '',
        password: ''
    });
      const navigate = useNavigate()

      const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login': 'register'}`,{
            method : 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        })
        if(res.status==400){
            alert('Invalid Credentials')
        }
        else{
            const resData = await res.json()
            if(resData.token){
                localStorage.setItem('user:token',resData.token)
                localStorage.setItem('user:detail',JSON.stringify(resData.user))
                navigate('/')
            }
      }}
    return (
        <div className="bg-gradient-to-r from-sky-500 from-10% via-sky-400 via-30% to-sky-200 to-90% ... h-screen flex items-center justify-center">
            <div className="bg-white w-[500px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
                <div className="text-4xl font-extrabold">Welcome {isSignInPage && 'Back'}</div>
                <div className="text-xl font-light mb-8">{isSignInPage ? 'Sign in to explore' : 'Sign Up to now get started'}</div>
                <form className="flex flex-col items-center w-full" onSubmit={(e)=> handleSubmit(e)}>
                {!isSignInPage && <Input label = "Full name" name="name" placeholder="Enter your full name" className="mb-6"
                value={data.fullName} onChange={(e) => setData({...data,fullName: e.target.value})}/>}
                <Input label = "Email address" name="email" placeholder="Enter your email" className="mb-6"
                value={data.email} onChange={(e) => setData({...data,email: e.target.value})}/>
                <Input label = "password" type='password' name="password" placeholder="Enter your password" className="mb-8"
                value={data.password} onChange={(e) => setData({...data,password: e.target.value})}/>
                <Button label={isSignInPage ? "Sign in":"Sign Up"} className="mb-3" type="submit"/>
                </form>
                <div>{isSignInPage ? "Don't Have an Account?":"Already have an account?"}<span className="text-primary cursor-pointer underline " onClick={() => navigate(`/users/${isSignInPage ? 'sign_up':'sign_in'}`)}>{isSignInPage ? "Sign up":"Sign in"}</span></div>
            </div>
        </div>
    )
}

export default Form;
