import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {loginUser} from '../../../_actions/user_action';
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();
    
    let body = {
      email: Email,
      password: Password
    }

    dispatch(loginUser(body))
    .then(response=> {
      if(response.payload.loginSuccess) {
        navigate("/");
      } else {
        alert('로그인 실패')
      }
    })
  }
  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button>Login</button>
      </form>
    </div>
  )
}