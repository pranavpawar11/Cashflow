import { React, useState, useContext } from 'react';
import '../css/login.css';
import { NavLink, useNavigate } from 'react-router-dom';
import ExpenseContext from '../context/expenseContext'

function Login() {

    const context = useContext(ExpenseContext);
    const { showAlert } = context;

    const [loginCred, setCred] = useState({ email: "", password: "", cpassword: "" })
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ email: loginCred.email, password: loginCred.password })
        })


        const res = await response.json();
        if (res.success) {
            localStorage.setItem('authToken', res.authToken);
            console.log(res.authToken)
            navigate('/');

            showAlert("You Loged in Successfully", "success")
        } else {
            showAlert("Incorrect Credentials", "danger")
        }
    }

    const onchange = (e) => {
        setCred({ ...loginCred, [e.target.name]: e.target.value })
    }
    return (
        <form className='my-3' onSubmit={handlesubmit}>
            <div className="container main-div">
                <div className="heading">
                    <h2>Welcome Back</h2>
                    <p>Glad to see you again!</p>
                </div>

                <div className="inputs">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="fa-solid fa-square-envelope"></i></span>
                        <input type="email" className="form-control" id='email' name='email' placeholder="Email" aria-label="Email" onChange={onchange} />
                    </div>

                    <div className="input-group mb-1">
                        <span className="input-group-text"><i className="fa-solid fa-key"></i></span>
                        <input type="password" className="form-control" id='password' name='password' placeholder="Password" aria-label="Password" onChange={onchange} />
                    </div>
                </div>

                <div className="actions">
                    <NavLink className="navbar-brand" to="/forgotpassword">
                        <span className="forgot-password">Forgot password?</span>
                    </NavLink>

                    <button type="submit" className="btn btn-primary">Login</button>
                </div>

                <div className="signup">
                    <p>
                        Don’t have an account?
                        <NavLink to="/signup">Sign up</NavLink>
                    </p>
                </div>
            </div>
        </form>
    );
}

export default Login;
