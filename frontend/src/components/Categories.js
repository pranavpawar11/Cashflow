import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CategoriesTabs from './Categories/CategoriesTabs';
import ExpenseContext from '../context/expenseContext';
import '../css/categories.css';

function Categories() {
    const context = useContext(ExpenseContext);
    const { fetchCategories, addNewCategory, showAlert, deleteCategory, updateCategoryLimit, expenseCategories, incomeCategories,usedBudget } = context;


    const [newCategory, setNewCategory] = useState('');
    const [categoryType, setCategoryType] = useState('income');
    const [showModal, setShowModal] = useState(false) ;
    const [selectedCategory, setSelectedCategory] = useState("");
    const [budget, setBudget] = useState('');
    const [CatusedBudget, setUsedBudget] = useState('');


    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            try {
                await addNewCategory(newCategory, categoryType);
                setNewCategory('');
                await fetchCategories();
            } catch (error) {
                showAlert("Internal Error Occured", "danger")
            }
        } else {

            showAlert("Please enter a category name", "info")
        }
    };

    const handleDeleteCategory = async (category, type) => {
        try {
            await deleteCategory(category, type);
            await fetchCategories();
        } catch (error) {
            showAlert("Failed to delete category", "danger")
        }
    };

    const handleDisplayModal = (cat,used) => {
        setSelectedCategory(cat.category);
        setBudget(cat.limit);
        setUsedBudget(used);
        setShowModal(true);
    };

    const handleUpdateBudget = async () => {
        try {
            await updateCategoryLimit(selectedCategory, budget);
            setShowModal(false);
            await fetchCategories();
        } catch (error) {
            showAlert("Internal Error Occured", "danger")
        }
    };

    return (
        <Container fluid className='py-4' style={{ height: 'auto', backgroundColor: '#F0F0F0' }}>
            <Row className="justify-content-center">
                <Col xs={12} lg={10} xl={8}>
                    <Card style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
                        <Card.Body>
                            <h2 className="text-center mb-4" style={{ color: '#4A90E2' }}>Category Management</h2>

                            <Form>
                                <Row className="align-items-end mb-4">
                                    <Col md={4} sm={6} xs={12} className="mb-3 mb-md-0">
                                        <Form.Group controlId="categoryType">
                                            <Form.Label style={{ color: '#4A4A4A', fontWeight: 'bold' }}>
                                                {/* <FontAwesomeIcon icon={faList} style={{ color: '#4A90E2', marginRight: '0.5rem' }} /> */}
                                                Category Type
                                            </Form.Label>
                                            <Form.Select
                                                value={categoryType}
                                                onChange={(e) => setCategoryType(e.target.value)}
                                                style={{ backgroundColor: '#F5F7FA', border: '1px solid #B7B7B7', borderRadius: '4px', color: '#4A4A4A' }}
                                            >
                                                <option value="income">Income</option>
                                                <option value="expense">Expense</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={5} sm={6} xs={12} className="mb-3 mb-md-0">
                                        <Form.Group controlId="newCategory">
                                            <Form.Label style={{ color: '#4A4A4A', fontWeight: 'bold' }}>
                                                {/* <FontAwesomeIcon icon={faIndianRupeeSign} style={{ color: '#4A90E2', marginRight: '0.5rem' }} /> */}
                                                New Category
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter new category name"
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                style={{ backgroundColor: '#F5F7FA', border: '1px solid #B7B7B7', borderRadius: '4px', color: '#4A4A4A' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3} sm={12}>
                                        <Button
                                            onClick={handleAddCategory}
                                            style={{ backgroundColor: '#3e3e3e', border: 'none', width: '100%' }}
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                                            Add Category
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>

                            <CategoriesTabs
                                expenseCategories={expenseCategories}
                                incomeCategories={incomeCategories}
                                categoryType={categoryType}
                                handleDisplayModal={handleDisplayModal}
                                handleDeleteCategory={handleDeleteCategory}
                                usedBudget={usedBudget}
                            />

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal for editing category */}
            {showModal && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="categoryName">
                                <Form.Label>Category Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedCategory}
                                    disabled={true}
                                />
                            </Form.Group>
                            <Form.Group controlId="budget">
                                <Form.Label>Budget</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="usedBudget">
                                <Form.Label>Used Budget</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={CatusedBudget}
                                    disabled={true}
                                    onChange={(e) => setUsedBudget(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" onClick={handleUpdateBudget}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

        </Container>
    );
}

export default Categories;
