import './App.css';
import React, { useContext } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Alert from './components/Alert';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ExpenseContext from './context/expenseContext'
import ExpenseCURD from './context/ExpenseCURD';
// import AddExpense from './components/AddExpense';
// import AddIncome from './components/AddIncome';
import AddExpenseIncome from './components/AddExpenseIncome'
import AllTransactions from './components/AllTransactions';
import Categories from './components/Categories';

const Layout = () => {
  const context = useContext(ExpenseContext);
  const { alert } = context;

  return (
    <>
      <Navbar />
      <Alert alert={alert} />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path:"/forgotpassword",
        element:<ForgotPassword/>
      },
      {
        path:"/addexpense",
        element:<AddExpenseIncome type={"expense"}/>
      },
      {
        path:"/addincome",
        element:<AddExpenseIncome type={"income"}/>
      },{
        path:"/alltransactions",
        element:<AllTransactions/>
      },{
        path:"/categories",
        element:<Categories/>
      }
      
    ],
  },
]);

function App() {
  return (
    <ExpenseCURD>
      <RouterProvider router={router} />
    </ExpenseCURD>
  );
}

export default App;
