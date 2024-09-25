import { React, useState, useContext } from 'react';
import '../css/signup.css';

import ExpenseContext from '../context/expenseContext'
import { NavLink } from 'react-router-dom';

function Signup() {

    const context = useContext(ExpenseContext);
    const { showAlert } = context;
    const [signUpCred, setCreads] = useState({ name: "", email: "", password: "", cpassword: "" });

    const onchange = (e) => {
        setCreads({ ...signUpCred, [e.target.name]: e.target.value });
    }

    const onsubmit = async (e) => {
        e.preventDefault();
        if (signUpCred.password === signUpCred.cpassword) {
            const response = await fetch('https://cashflow-backend-3nmj.onrender.com/api/auth/createuser', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ name: signUpCred.name, email: signUpCred.email, password: signUpCred.password })
            })

            let res = await response.json();
            if (res.success) {
                console.log(res.authToken)
                showAlert("You SignedUp Successfully", "success")
            } else {
                showAlert("Sign Not Possible due to internal issue", "danger")
            }

        } else {
            showAlert("Passwords do not match", "danger")
        }
    }

    return (
        <form onSubmit={onsubmit}>
            <div className="container main-div">
                <div className="heading">
                    <h2>Create an Account</h2>
                    <p>Join us today!</p>
                </div>

                <div className="inputs">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="fa-solid fa-user"></i></span>
                        <input type="text" className="form-control" placeholder="Name" aria-label="Name" id="name" name='name' value={signUpCred.name} onChange={onchange} minLength={3} required />
                    </div>

                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="fa-solid fa-square-envelope"></i></span>
                        <input type="email" className="form-control" placeholder="Email" aria-label="Email" id="email" name='email' value={signUpCred.email} onChange={onchange} required />
                    </div>

                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="fa-solid fa-key"></i></span>
                        <input type="password" className="form-control" placeholder="Password" aria-label="Password" id="password" name='password' value={signUpCred.password} onChange={onchange} minLength={5} required />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="fa-solid fa-key"></i></span>
                        <input type="password" className="form-control" placeholder="Confirm Password" aria-label="Password" id="cpassword" name='cpassword' value={signUpCred.cpassword} onChange={onchange} minLength={5} required />
                    </div>
                </div>

                <div className="actions">
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </div>

                <div className="login">
                    <p>
                        Already have an account?
                        <NavLink to="/login">Log in</NavLink>
                    </p>

                </div>
            </div>
        </form>
    );
}

export default Signup;
