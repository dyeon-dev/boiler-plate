import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {registerUser} from '../../../_actions/user_action';
import Auth from "../../../hoc/auth";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState('')
  const [Name, setName] = useState('')
  const [Password, setPassword] = useState('')
  const [ConfirmPassword, setConfirmPassword] = useState('')
  
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }
  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();
    
    if(Password!==ConfirmPassword) {
      return alert('비밀번호가 일치하지 않습니다.')
    }
    let body = {
      email: Email,
      name: Name,
      password: Password,
    }

    dispatch(registerUser(body))
    .then(response=> {
      if(response.payload.success) {
        navigate("/login");
      } else {
        alert('회원 가입 실패')
      }
    })
    .catch(error => {
      console.error('Error during registration:', error);
    });
  }
  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <br />
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />
        <br />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <label>Confirm Password</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
        <br />
        <button>SignUp</button>
      </form>
    </div>
  )
}
export default Auth(RegisterPage, false);