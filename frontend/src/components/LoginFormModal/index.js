import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isDisabled = () => {
    if(credential?.length >=4 && password?.length >=6) return false;
    else return true;
  }

  const handleDemo = (e) => {
    e.preventDefault();
    setErrors({});
    if(credential === "Demo-lition" && password === "password"){
      return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const errBackend = await res.json();
        if (errBackend) {
          setErrors(prevErrors=>{
            const newErrors = {...prevErrors};
            newErrors["login"] = "The provided credentials were invalid";
            return newErrors;
          })
        }
      });
    }else{
      setErrors(prevErrors=>{
        const newErrors = {...prevErrors};
        newErrors["login"] = "The provided credentials were invalid";
        return newErrors;
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const errBackend = await res.json();
        if (errBackend) {
          setErrors(prevErrors=>{
            const newErrors = {...prevErrors};
            newErrors["login"] = "The provided credentials were invalid";
            return newErrors;
          })
        }
      });
  };

  return (
    <div className="loginModal">
      <h1>Log In</h1>
      <h2 className="errors">{errors.login}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={isDisabled()} className="loginButton">Log In</button>
        <button type="submit" disabled={isDisabled()} onClick={handleDemo} className="loginButton">Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;