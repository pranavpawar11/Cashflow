import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function TransactionModals({
    showEditModal,
    setShowEditModal,
    showViewModal,
    setShowViewModal,
    selectedTransaction,
    handleSaveChanges,
    handleEditTransaction,
    handleDeleteTransaction
}) {
    const [editedTransaction, setEditedTransaction] = useState({
        type: '',
        amount: '',
        category: '',
        tag: '',
        description: ''
    });

    useEffect(() => {
        if (selectedTransaction) {
            setEditedTransaction({
                type: selectedTransaction.type,
                amount: selectedTransaction.amount,
                category: selectedTransaction.category,
                tag: selectedTransaction.tag,
                description: selectedTransaction.description
            });
        }
    }, [selectedTransaction]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setEditedTransaction(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSave = () => {
        handleSaveChanges(editedTransaction);
    };

    return (
        <>
            {/* Edit Transaction Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="type">
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" value={editedTransaction.type} onChange={handleChange}>
                                <option>Income</option>
                                <option>Expense</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="amount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" value={editedTransaction.amount} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" value={editedTransaction.category} onChange={handleChange}>
                                <option>Groceries</option>
                                <option>Entertainment</option>
                                <option>Bills</option>
                                <option>Transport</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="tag">
                            <Form.Label>Tag</Form.Label>
                            <Form.Control type="text" value={editedTransaction.tag} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" value={editedTransaction.description} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" className='my-2' onClick={handleSave}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* View Transaction Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>View Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTransaction && (
                        <div>
                            <p><strong>Date:</strong> {selectedTransaction.date}</p>
                            <p><strong>Category:</strong> {selectedTransaction.category}</p>
                            <p><strong>Description:</strong> {selectedTransaction.description}</p>
                            <p><strong>Tag:</strong> {selectedTransaction.tag}</p>
                            <p><strong>Type:</strong> {selectedTransaction.type}</p>
                            <p><strong>Amount:</strong> ₹{selectedTransaction.amount.toLocaleString()}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-warning" className="mr-2 action-button" onClick={() => handleEditTransaction(selectedTransaction)}>
                        Edit
                    </Button>
                    <Button variant="outline-danger" className="action-button" onClick={() => handleDeleteTransaction(selectedTransaction)}>
                        Delete
                    </Button>
                    <Button variant="outline-secondary" className="action-button" onClick={() => setShowViewModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TransactionModals;
