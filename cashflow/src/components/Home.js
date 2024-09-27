import React, { useEffect, useRef, useContext, useState } from 'react';
import '../css/home.css';
import { useNavigate, NavLink } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faWallet, faArrowUp, faArrowDown, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Chart, registerables } from 'chart.js';
import ExpenseContext from '../context/expenseContext';

// Register Chart.js components
Chart.register(...registerables);

function Home() {
    const context = useContext(ExpenseContext);
    const { selectedMonth, getTransactions, initializeCurrentMonthGraphData, calculateTotalsAndBudget, initializeGraphData, transactionsData, handleNextMonth, handlePreviousMonth, } = context;
    const [cardData, setCardData] = useState([]);
    const navigate = useNavigate();
    // eslint-disable-next-line

    // eslint-disable-next-line
    const [filterCategory, setFilterCategory] = useState('');

    const filteredTransactions = transactionsData[selectedMonth]?.filter(
        transaction => filterCategory === '' || transaction.category === filterCategory
    ) || [];

    useEffect(() => {
        const initalTrasactionsData = async () => {
            if (!localStorage.getItem('authToken')) {
                navigate('/login');
            } else {
                await getTransactions();
            }
        }
        initalTrasactionsData()
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchAndSetData = async () => {
            const { totalIncome, totalExpenses, budgetPercentage } = await calculateTotalsAndBudget(transactionsData, selectedMonth);
            const totalBalance = totalIncome - totalExpenses;
            const balanceColor = totalBalance >= 0 ? "success" : "danger";

            let budgetStatusColor = "success";

            if (totalExpenses > totalIncome) {
                budgetStatusColor = "danger";
            } else if (budgetPercentage > 100) {
                budgetStatusColor = "warning";
            }

            setCardData([
                {
                    title: "Total Income",
                    value: `₹${totalIncome}`,
                    icon: faArrowUp,
                    color: "primary", // Green for income
                },
                {
                    title: "Remaining Balance",
                    value: `₹${totalBalance}`,
                    icon: faWallet,
                    color: balanceColor, // Use dynamic color based on balance
                },
                {
                    title: "Total Expenses",
                    value: `₹${totalExpenses}`,
                    icon: faArrowDown,
                    color: "danger", // Red for expenses
                },
                {
                    title: "Budget Status",
                    value: `${budgetPercentage}%`,
                    icon: faChartPie,
                    color: budgetStatusColor, // Color based on budget status
                }
            ]);
        };

        fetchAndSetData();
        // eslint-disable-next-line
    }, [transactionsData, selectedMonth]); // Include dependencies to re-fetch data on changes



    const pieChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const pieChartInstance = useRef(null);
    const lineChartInstance = useRef(null);

    useEffect(() => {
        const fetchAndInitializeGraphData = async () => {
            const gData = await initializeGraphData(transactionsData);
            const labels_data = Object.keys(gData);
            const values_data = Object.values(gData);

            if (pieChartRef.current) {
                if (pieChartInstance.current) {
                    pieChartInstance.current.destroy();
                }

                pieChartInstance.current = new Chart(pieChartRef.current, {
                    type: 'pie',
                    data: {
                        labels: labels_data,
                        datasets: [{
                            label: ' Amount ',
                            data: values_data,
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                            borderColor: '#fff',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        const dataset = tooltipItem.dataset;
                                        const currentvalue = dataset.data[tooltipItem.dataIndex];
                                        const total = dataset.data.reduce((acc, value) => acc + value, 0);
                                        const percentage = ((currentvalue / total) * 100).toFixed(2);
                                        return `Amount: ₹${currentvalue.toLocaleString()} (${percentage}%)`
                                    },
                                },
                            },
                            legend: {
                                position: 'top'
                            },
                        },
                    }
                });
            }
        };

        fetchAndInitializeGraphData();

        return () => {
            if (pieChartInstance.current) {
                pieChartInstance.current.destroy();
            }
        };
        // eslint-disable-next-line 
    }, [ selectedMonth,transactionsData]);

    useEffect(() => {
        const updateChartData = async () => {
            const { incomeData, expensesData, balanceData, labels } = await initializeCurrentMonthGraphData(transactionsData, selectedMonth);

            if (lineChartRef.current) {
                if (lineChartInstance.current) {
                    lineChartInstance.current.destroy();
                }

                lineChartInstance.current = new Chart(lineChartRef.current, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Income',
                                data: incomeData,
                                borderColor: '#4A90E2',
                                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                                fill: true
                            },
                            {
                                label: 'Expenses',
                                data: expensesData,
                                borderColor: '#D0021B',
                                backgroundColor: 'rgba(208, 8, 27, 0.2)',
                                fill: true
                            },
                            {
                                label: 'Balance',
                                data: balanceData,
                                borderColor: '#20ad6b',
                                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                fill: true
                            }
                        ]
                    },
                    options: {
                        responsive: true
                    }
                });
            }
        };


        updateChartData();
        // eslint-disable-next-line 
    }, [ selectedMonth, transactionsData]);




    return (
        <Container fluid className="home-container py-4">
            <Row className="mb-4 align-items-center">
                <Col xs={12} md={6}>
                    <h1 className="welcome-text">Hello, Pranav!</h1>
                    <p className="text-muted">Here's your financial overview of {selectedMonth.split(" ")[0]}.</p>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-md-end">
                    <div className="month-buttons">
                        <Button variant="text" className="month-button" onClick={handlePreviousMonth}>
                            <FaChevronLeft />
                        </Button>
                        <h3 className="mb-0 mx-3 selected-month">{selectedMonth.slice(0, 3) + " " + selectedMonth.split(" ")[1]}</h3>
                        <Button variant="text" className="month-button" onClick={handleNextMonth}>
                            <FaChevronRight />
                        </Button>
                    </div>
                </Col>
            </Row>


            <Row className="mb-4">
                {cardData.map((item, index) => (
                    <Col key={index} lg={3} md={6} xs={6} className="mb-3">
                        <Card className={`overview-card border-0 shadow-sm rounded-3`}>
                            <Card.Body className="d-flex align-items-center">
                                <div className={`icon-bg d-flex align-items-center justify-content-center me-3 rounded-circle bg-${item.color}`}
                                    style={{ width: '50px', height: '50px' }}>
                                    <FontAwesomeIcon icon={item.icon} size="lg" className="text-white" />
                                </div>
                                <div className="text-container">
                                    <Card.Title className="mb-0 text-dark fw-semibold">{item.title}</Card.Title>
                                    <Card.Text className={`text-${item.color} fw-bold fs-4`}>{item.value}</Card.Text>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>



            <Row className="mb-4 align-items-center">
                <Col xs={12} className="text-md-end">
                    <div className="d-flex gap-3">
                        <Button variant="outline-success" className="flex-fill" size="lg" onClick={() => navigate("/addincome")}>
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Add Income
                        </Button>
                        <Button variant="outline-danger" className="flex-fill" size="lg" onClick={() => navigate("/addexpense")}>
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Add Expense
                        </Button>
                    </div>
                </Col>

            </Row>

            <Row className="mb-4">
                <Col lg={6} md={12} className="mb-3">
                    <Card className="chart-card h-100">
                        <Card.Body>
                            <Card.Title>Spending Overview</Card.Title>
                            <canvas ref={pieChartRef} height="400" width="400" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6} md={12} className="mb-3">
                    <Card className="chart-card h-100">
                        <Card.Body>
                            <Card.Title>Income vs. Expenses</Card.Title>
                            <canvas ref={lineChartRef} height="400" width="400" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="">
                        <Card.Body className="p-3 p-md-4">
                            <Card.Title>Recent Transactions</Card.Title>
                            {filteredTransactions.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                            <tr className="d-none table-headings d-md-table-row">
                                                <th>Date</th>
                                                <th>Category</th>
                                                <th>Description</th>
                                                <th>Tag</th>
                                                <th>Type</th>
                                                <th>Amount</th>
                                            </tr>
                                            <tr className="d-md-none">
                                                <th>Date</th>
                                                <th>Amount</th>
                                                <th>Type</th>
                                            </tr>
                                        </thead>
                                        <tbody className='tbody-data' >


                                            {filteredTransactions.slice(0, 3).map((transaction, index) => (
                                                <React.Fragment key={index}>
                                                    <tr className="d-none d-md-table-row">
                                                        <td>{transaction.date}</td>
                                                        <td>
                                                            <Badge bg="secondary" pill>{transaction.category}</Badge>
                                                        </td>
                                                        <td>{transaction.description}</td>
                                                        <td>
                                                            <Badge bg="secondary" pill>{transaction.tag}</Badge>
                                                        </td>
                                                        <td>
                                                            <Badge bg={transaction.type === 'Income' ? 'success' : 'danger'} pill>
                                                                {transaction.type}
                                                            </Badge>
                                                        </td>
                                                        <td className={transaction.type === 'Income' ? 'text-success' : 'text-danger'}>
                                                            ₹{transaction.amount.toLocaleString()}
                                                        </td>

                                                    </tr>
                                                    <tr className="d-md-none">
                                                        <td>{transaction.date}</td>
                                                        <td className={transaction.type === 'Income' ? 'text-success' : 'text-danger'}>
                                                            ₹{transaction.amount.toLocaleString()}
                                                        </td>
                                                        <td>
                                                            <Badge bg={transaction.type === 'Income' ? 'success' : 'danger'} pill>
                                                                {transaction.type}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center">No transactions found for this month.</p>
                            )}
                            <NavLink to="/allTransactions" style={{ color: '#17a2b8', textDecoration: 'none' }}>View All Transactions</NavLink>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;
