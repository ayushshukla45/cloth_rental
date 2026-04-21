import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidForm = () => {
    const { email, password, username } = formData;

    if (!email || !password) {
      alert("Email and password are required");
      return false;
    }

    if (state === "Sign Up") {
      if (!username) {
        alert("Username is required for signup");
        return false;
      }
      if (username.includes('@')) {
        alert("Username cannot be an email");
        return false;
      }
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Invalid email format");
      return false;
    }

    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "icloud.com",
    ];
    const emailDomain = email.split('@')[1];
    if (!allowedDomains.includes(emailDomain)) {
      alert("This email domain is not authorized to log in.");
      return false;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
    if (!passwordPattern.test(password)) {
      alert("Password must have at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be 6+ characters.");
      return false;
    }

    return true;
  };

  const login = async () => {
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    } else {
      if (responseData.errors === "Please sign up before logging in.") {
        alert("Please sign up before logging in.");
      } else if (responseData.errors === "Wrong password") {
        alert("Incorrect password. Please try again.");
      } else {
        alert("Please sign up before logging in.");
      }
    }
  };

  const signup = async () => {
    let responseData;
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    } else {
      alert(responseData.errors || "Signup failed. Try another email.");
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              name='username'
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder='Your Name'
              required
              minLength={3}
            />
          )}

          <input
            name='email'
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder='Your Email'
            required
          />

          <div className="password-input">
            <input
              name='password'
              value={formData.password}
              onChange={changeHandler}
              type={showPassword ? "text" : "password"}
              placeholder='Password'
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
        </div>

        <button onClick={() => {
          if (isValidForm()) {
            state === "Login" ? login() : signup();
          }
        }}>
          Continue
        </button>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?
            <span onClick={() => setState("Login")}> Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?
            <span onClick={() => setState("Sign Up")}> Click here</span>
          </p>
        )}

        {state === "Login" && (
          <p className="password-reset-link">
            <span onClick={() => window.location.href = "/reset-password"}>Forgot password?</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use and privacy policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
