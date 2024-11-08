import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Home, PlusCircle, DollarSign, List, Grid, LogOut } from 'lucide-react';
import Alert from './Alert';
import ExpenseContext from '../context/expenseContext';
import '../css/navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(ExpenseContext);
  const { showAlert } = context;
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate("/login");
    }
  }, [navigate]);

  const logout = (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      localStorage.removeItem('authToken');
      showAlert("You Logged out Successfully", 'danger');
      navigate('/login');
    } else {
      showAlert("No user is currently logged in", 'warning');
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <NavLink className="navbar-brand" to="/">
            CashFlow
          </NavLink>
          {localStorage.getItem('authToken') && (
            <div className="nav-elements">
              <ul className="nav-list">
                <li><NavLink to="/" onClick={toggleMenu}><Home size={18} /><span>Home</span></NavLink></li>
                <li><NavLink to="/addexpense" onClick={toggleMenu}><PlusCircle size={18} /><span>Add Expense</span></NavLink></li>
                <li><NavLink to="/addincome" onClick={toggleMenu}><DollarSign size={18} /><span>Add Income</span></NavLink></li>
                <li><NavLink to="/alltransactions" onClick={toggleMenu}><List size={18} /><span>All Transactions</span></NavLink></li>
                <li><NavLink to="/categories" onClick={toggleMenu}><Grid size={18} /><span>Categories</span></NavLink></li>
              </ul>
            </div>
          )}

          {localStorage.getItem('authToken') && (
            <div className="navbar-right">
              <button className="logout-btn" onClick={logout}>
                <LogOut size={18} />
                <span className="logout-text">Logout</span>
              </button>

              <button className="menu-toggle" onClick={toggleMenu}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

            </div>
          )}
        </div>
      </nav>
      {isOpen && (
        <div className="mobile-nav-overlay">
          <div className="mobile-nav-content">
            <button className="close-menu" onClick={toggleMenu}>
              <X size={24} />
            </button>
            <ul className="mobile-nav-list">
              <li><NavLink to="/" onClick={toggleMenu}>Home</NavLink></li>
              <li><NavLink to="/addexpense" onClick={toggleMenu}>Add Expense</NavLink></li>
              <li><NavLink to="/addincome" onClick={toggleMenu}>Add Income</NavLink></li>
              <li><NavLink to="/alltransactions" onClick={toggleMenu}>All Transactions</NavLink></li>
              <li><NavLink to="/categories" onClick={toggleMenu}>Categories</NavLink></li>
            </ul>
            {/* <div className="mobile-nav-footer">
              <p>Contact</p>
              <p>info@cashflow.com</p>
              <p>+1 (555) 123-4567</p>
              <div className="social-icons">
              </div>
            </div> */}
          </div>
        </div>
      )}
      <Alert />
    </>
  );
}

export default Navbar;