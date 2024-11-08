import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

function TransactionTable(props) {
    return (
        <div className="table-responsive">
            {props.filteredTransactions.length > 0 ? (
                <table className="table table-hover">
                    <thead className="bg-light">
                        <tr className="d-none table-headings d-md-table-row">
                            <th>Date</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Tag</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                        <tr className="d-md-none">
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='tbody-data'>
                        {props.filteredTransactions.map((transaction, index) => (
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
                                    <td>
                                        <Button variant="outline-warning" size="sm" className="mr-2 action-button mx-1" onClick={() => props.handleEditTransaction(transaction)}>
                                            <FaEdit />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" className="action-button mx-1 my-1" onClick={() => props.handleDeleteTransaction(transaction)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                                <tr className="d-md-none">
                                    <td>{transaction.date}</td>
                                    <td className={transaction.type === 'Income' ? 'text-success' : 'text-danger'}>
                                        ₹{transaction.amount.toLocaleString()}
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="action-button" onClick={() => props.handleViewTransaction(transaction)}>
                                            <FaEye />
                                        </Button>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center">No transactions found for this month.</p>
            )}
        </div>
    );
}

export default TransactionTable;