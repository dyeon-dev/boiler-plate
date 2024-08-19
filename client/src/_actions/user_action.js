import axios from "axios";
import { LOGIN_USER } from "./types";

export default function loginUser(dataToSubmit) {
  const request = axios
  .post("http://localhost:5000/api/users/login", dataToSubmit)
  .then((response) => response.data);
  
  // request를 reducer에 넘겨준다
  return {
    type: LOGIN_USER,
    payload: request,
  };
}
