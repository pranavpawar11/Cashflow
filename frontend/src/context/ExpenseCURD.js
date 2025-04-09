import React, { useEffect, useState } from "react";
import ExpenseCURD from "./expenseContext";

const ManageExpense = (props) => {
  const host = 'http://localhost:5002';
  const [alert, setAlert] = useState({ msg: "", type: "" });

  const initalTrasactions = [];

  const [transactionsData, setTransactionsData] = useState(initalTrasactions);
  const [onlytransactions, setOnlyTransactions] = useState(initalTrasactions);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [usedBudget, setusedBudget] = useState([]);
  const [allCategory, setCategories] = useState(['cat1', 'cat2']);
  const [userData, setuserData] = useState([])

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => {
      setAlert(null);
    }, 1700);
  };

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const getuserDetails = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    const response = await fetch(`${host}/api/auth/getuser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      }
    });
    const json = await response.json();
    
    if (json.success) {
      setuserData(json.data);
    } else {
      console.log("Error in fetching transactions from DB");
    }
  }
  // months handling 

  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  const handlePreviousMonth = () => {
    const currentMonthYear = selectedMonth.split(" ");
    const currentMonth = currentMonthYear[0];
    const currentYear = parseInt(currentMonthYear[1], 10);

    const currentIndex = months.indexOf(currentMonth);
    let previousIndex = (currentIndex - 1 + 12) % 12;
    let previousYear = currentYear;

    if (previousIndex === 11) {
      previousYear -= 1;
    }

    const previousMonthYear = `${months[previousIndex]} ${previousYear}`;
    setSelectedMonth(previousMonthYear);
  };
  const handleNextMonth = () => {
    const currentMonthYear = selectedMonth.split(" ");
    const currentMonth = currentMonthYear[0];
    const currentYear = parseInt(currentMonthYear[1], 10);

    const currentIndex = months.indexOf(currentMonth);
    let nextIndex = (currentIndex + 1) % 12;
    let nextYear = currentYear;

    if (nextIndex === 0) {
      nextYear += 1;
    }

    const nextMonthYear = `${months[nextIndex]} ${nextYear}`;
    setSelectedMonth(nextMonthYear);
  };




  const getCurrentMonth = () => {
    const now = new Date();
    const options = { month: 'long', year: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  };
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const initializeGraphData = async () => {
    const t_Data = {};

    // Get transactions for the selected month
    const transactions = transactionsData[selectedMonth] || [];

    // Process transactions
    transactions.forEach((transaction) => {
      if (!t_Data[transaction.category] && transaction.type === 'Expense') {
        t_Data[transaction.category] = 0;
      }

      if (transaction.type === 'Expense') {
        t_Data[transaction.category] += transaction.amount;
      }
    });

    return t_Data;
  }

  const calculateTotalsAndBudget = (transactionsData, selectedMonth) => {
    // Parse the selectedMonth string
    const [monthName, year] = selectedMonth.split(' ');
    const monthIndex = new Date(Date.parse(`${monthName} 1, 2021`)).getMonth(); // Get month index
    const selectedYear = parseInt(year);

    // Get transactions for the selected month
    const transactions = transactionsData[selectedMonth] || [];

    // Filter transactions for the selected month and year
    const currentMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === selectedYear && transactionDate.getMonth() === monthIndex;
    });

    // Calculate total income and total expenses
    const totalIncome = currentMonthTransactions
      .filter(transaction => transaction.type === 'Income')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter(transaction => transaction.type === 'Expense')
      .reduce((total, transaction) => total + transaction.amount, 0);

    // Calculate budget percentage
    const budgetPercentage = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(2) : 0;

    return { totalIncome, totalExpenses, budgetPercentage };
  };




  const initializeCurrentMonthGraphData = (transactionsData, selectedMonth) => {
    const incomeData = [0];
    const expensesData = [0];
    const balanceData = [0];
    const labels = [selectedMonth];

    // Parse the selectedMonth string
    const [monthName, year] = selectedMonth.split(' ');
    const monthIndex = new Date(Date.parse(`${monthName} 1, 2021`)).getMonth(); // Use any year to get month index
    const selectedYear = parseInt(year);

    // Get transactions for the selected month
    const transactions = transactionsData[selectedMonth] || [];

    // Process transactions
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();

      if (transactionMonth === monthIndex && transactionYear === selectedYear) {
        if (transaction.type === 'Income') {
          incomeData[0] += transaction.amount;
          balanceData[0] += transaction.amount;
        } else if (transaction.type === 'Expense') {
          expensesData[0] += transaction.amount;
          balanceData[0] -= transaction.amount;
        }
      }
    });

    return { incomeData, balanceData, expensesData, labels };
  };



  const groupTransactionsByMonthYear = (transactions) => {
    const transactionsData = {};
    transactions.forEach((transaction) => {
      const dateformat = transaction.date.slice(0, 10)
      transaction.date = dateformat;
      // eslint-disable-next-line 
      const [year, month, day] = dateformat.split('-').map(Number);
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthYearKey = `${monthNames[month - 1]} ${year}`;

      if (!transactionsData[monthYearKey]) {
        transactionsData[monthYearKey] = [];
      }

      transactionsData[monthYearKey].push(transaction);
    });

    return transactionsData;
  };

  const fetchCategories = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    const response = await fetch(`${host}/api/category/fetchallcategories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      }
    });
    const json = await response.json();

    if (json.success) {
      setCategories(json.allcategories);
    } else {
      console.log("Error in fetching transactions from DB");
    }
  }


  const getTransactions = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    const response = await fetch(`${host}/api/transactions/fetchalltransactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      }
    });
    const json = await response.json();

    if (json.success) {
      setOnlyTransactions(json.alltransactions);
      const groupedData = await groupTransactionsByMonthYear(json.alltransactions);
      setTransactionsData(groupedData);
    } else {
      console.log("Error in fetching transactions from DB");
    }
  }


  const addnewTransaction = async (expenseData) => {
    try {
      const response = await fetch(`${host}/api/transactions/addtransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('authToken')
        },
        body: JSON.stringify(expenseData)
      });

      const result = await response.json();
      if (response.ok) {
        showAlert("Trascation Added Successfully", "success");
      } else {
        setAlert(`Error: ${result.errors ? result.errors.map(error => error.msg).join(', ') : 'An error occurred'}`);
      }
    } catch (error) {
      setAlert('An error occurred while adding the expense.');
      console.error('Error:', error);
    }
  }



  const deleteTransaction = async (id) => {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const newTransactions = onlytransactions.filter((transaction) => transaction._id !== id);
    const response = await fetch(`${host}/api/transactions/deletetransaction/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      }
    });
    if (response.status === 200) {
      setOnlyTransactions(newTransactions);
      setTransactionsData(onlytransactions)
      showAlert("Transaction Deleted Successfully", "danger")
    }
  };

  const updateTransaction = async (id, updatedTransaction) => {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const response = await fetch(`${host}/api/transactions/updatetransaction/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({ type: updatedTransaction.type, amount: updatedTransaction.amount, category: updatedTransaction.category, tag: updatedTransaction.tag, description: updatedTransaction.description })
    });

    if (response.status === 200) {
      const newTransactions = onlytransactions.map(transaction =>
        transaction._id === id ? { ...transaction, ...updatedTransaction } : transaction
      );
      setOnlyTransactions(newTransactions);
      setTransactionsData(newTransactions);
      showAlert("Transaction Updated Successfully", "success");
    } else {
      console.error('Failed to update transaction');
    }
  };


  const addNewCategory = async (category, type) => {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    const lowerCaseCategory = category.toLowerCase();
    try {
      const response = await fetch(`${host}/api/category/addcategory`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ category: lowerCaseCategory, type })
      });

      const result = await response.json();
      if (result.success) {
        showAlert(result.msg, "success");
      } else {
        showAlert(result.msg, "info");
      }
    } catch (error) {
      setAlert('An error occurred while adding the expense.');
      console.error('Error:', error);
    }
  }

  const deleteCategory = async (category, type) => {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    if (category === 'Other') {

      showAlert("You can't delete Other Category", "info");
      return;
    }

    const response = await fetch(`${host}/api/category/deletecategory`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({ category, type })
    });
    const result = await response.json();
    if (result.success) {
      showAlert(result.msg, "success");
    } else {
      console.log(result.msg)
      showAlert(result.msg, "danger");
    }
  }

  const updateCategoryLimit = async (category, newLimit) => {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const response = await fetch(`${host}/api/category/updatecategory`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({ category, newLimit })
    });

    const result = await response.json();
    if (result.success) {
      showAlert(result.msg, "success");
    } else {
      console.log(result.msg);
      showAlert(result.msg, "danger");
    }
  };


  useEffect(() => {
    getTransactions();
    fetchCategories();
    // eslint-disable-next-line 
  }, []);

  useEffect(() => {
    const fetchAndSetCategories = async () => {
      const gData = await initializeGraphData(transactionsData);
      setusedBudget(gData)


      await fetchCategories();
      if (allCategory && allCategory.length > 0) {
        // Process expense categories
        const expenseObject = allCategory[0].expense || {};
        const expenseCategoriesArray = Object.entries(expenseObject).map(([category, limit]) => ({
          category,
          limit
        }));
        // Process income categories
        const incomeObject = allCategory[0].income || {};
        const incomeCategoriesArray = Object.entries(incomeObject).map(([category, { limit }]) => ({
          category,
          limit
        }));

        // Update state
        setExpenseCategories(expenseCategoriesArray);
        setIncomeCategories(incomeCategoriesArray);
      }
    };
    fetchAndSetCategories();
    // eslint-disable-next-line
  }, [allCategory]);


  return (
    <ExpenseCURD.Provider value={{ alert,userData, transactionsData, allCategory, getuserDetails,setTransactionsData, showAlert, getTransactions, groupTransactionsByMonthYear, onlytransactions, setOnlyTransactions, deleteTransaction, updateTransaction, addnewTransaction, initializeGraphData, initializeCurrentMonthGraphData, calculateTotalsAndBudget, fetchCategories, selectedMonth, setSelectedMonth, handlePreviousMonth, handleNextMonth, addNewCategory, deleteCategory, updateCategoryLimit, expenseCategories, incomeCategories, usedBudget }}>
      {props.children}
    </ExpenseCURD.Provider>
  );
};


export default ManageExpense;
