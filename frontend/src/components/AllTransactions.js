import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../css/allTransactions.css';
import ExpenseContext from '../context/expenseContext';
import TransactionTable from './Transactions/TransactionTable';
import TransactionFilter from './Transactions/TransactionFilter';
import TransactionModals from './Transactions/TransactionModals';

function AllTransactions() {
    const context1 = useContext(ExpenseContext);
    const { selectedMonth, handleNextMonth, handlePreviousMonth, transactionsData, deleteTransaction,updateTransaction, allCategory, fetchCategories, expenseCategories, getTransactions } = context1;
    const navigate = useNavigate();

    const [filterCategory, setFilterCategory] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('authToken')) {
            navigate('/login');
        }
        getTransactions();
    }, [navigate, fetchCategories, allCategory, getTransactions]);

    const handleViewTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setShowViewModal(true);
    };

    const handleFilterChange = (category) => {
        setFilterCategory(category);
    };

    const handleSortChange = (key, direction) => {
        setSortConfig({ key, direction });
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleEditTransaction = (transaction) => {
        setSelectedTransaction(transaction);

        setShowEditModal(true);
    };

    const handleDeleteTransaction = async (transaction) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete the transaction with category "${transaction.category}"?`);

        if (isConfirmed) {
            try {
                deleteTransaction(transaction._id);

            } catch (error) {
                console.error("Error deleting transaction:", error);
            }
        } else {
            console.log("Transaction deletion canceled.");
        }
    };

    const handleSaveChanges = (editedTransaction) => {
        const updatedTransaction = {
            type: editedTransaction.type,
            amount: editedTransaction.amount,
            category: editedTransaction.category,
            tag: editedTransaction.tag,
            description: editedTransaction.description,
        };
        updateTransaction(selectedTransaction._id, updatedTransaction);
        setShowEditModal(false);
    };

    const filteredAndSortedTransactions = transactionsData[selectedMonth]
        ?.filter(transaction =>
            (filterCategory === '' || transaction.category === filterCategory) &&
            (searchTerm === '' ||
                transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.amount.toString().includes(searchTerm))
        )
        .sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        }) || [];

    return (
        <Container fluid className='my-4 all-transactions'>
            <Row className="justify-content-center">
                <Col xs={12} lg={10} xl={8}>
                    <Card className="section-head">
                        <Card.Body className="title-card">
                            <Card.Title className="text-center mb-4 title allTransactions-heading">{selectedMonth.split(' ')[0]}'s Transactions</Card.Title>
                            <TransactionFilter
                                selectedMonth={selectedMonth}
                                handlePreviousMonth={handlePreviousMonth}
                                handleNextMonth={handleNextMonth}
                                handleFilterChange={handleFilterChange}
                                handleSortChange={handleSortChange}
                                handleSearch={handleSearch}
                                expenseCategories={expenseCategories}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs={12} lg={10} xl={8}>
                    <Card className="transactions-card shadow-lg">
                        <Card.Body className="p-3 p-md-4">
                            <TransactionTable
                                filteredTransactions={filteredAndSortedTransactions}
                                handleViewTransaction={handleViewTransaction}
                                handleEditTransaction={handleEditTransaction}
                                handleDeleteTransaction={handleDeleteTransaction}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <TransactionModals
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                showViewModal={showViewModal}
                setShowViewModal={setShowViewModal}
                selectedTransaction={selectedTransaction}
                handleSaveChanges={handleSaveChanges}
                handleEditTransaction={handleEditTransaction}
                handleDeleteTransaction={handleDeleteTransaction}
            />
        </Container>
    );
}

export default AllTransactions;