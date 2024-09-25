import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faList, faCalendar, faFileAlt, faTags } from '@fortawesome/free-solid-svg-icons';

function AddIncome() {
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [categories, setCategories] = useState(['Salary', 'Investments', 'Gifts', 'Other']);
    const [customCategory, setCustomCategory] = useState('');

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === 'Other') {
            setIsCustomCategory(true);
        } else {
            setIsCustomCategory(false);
            setCustomCategory('');
        }
    };

    const handleCustomCategoryChange = (e) => {
        setCustomCategory(e.target.value);
    };

    const addCustomCategory = () => {
        if (customCategory && !categories.includes(customCategory)) {
            setCategories([...categories, customCategory]);
            setIsCustomCategory(false);
        }
    };

    const formStyle = {
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
    };

    const inputStyle = {
        backgroundColor: '#F5F7FA',
        border: '1px solid #B7B7B7',
        borderRadius: '4px',
        color: '#4A4A4A',
    };

    const labelStyle = {
        color: '#4A4A4A',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
    };

    const iconStyle = {
        color: '#4A90E2',
        marginRight: '0.5rem',
    };

    return (
        <Container fluid className="py-5" style={{ backgroundColor: '#F0F0F0' }}>
            <Row className="justify-content-center">
                <Col xs={12} lg={10} xl={8}>
                    <Card style={formStyle}>
                        <Card.Body>
                            <h2 className="text-center mb-4" style={{ color: '#4A90E2' }}>Add New Income</h2>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="incomeAmount">
                                            <Form.Label style={labelStyle}>
                                                <FontAwesomeIcon icon={faDollarSign} style={iconStyle} />
                                                Income Amount
                                            </Form.Label>
                                            <Form.Control type="number" placeholder="Enter amount" required style={inputStyle} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="incomeCategory">
                                            <Form.Label style={labelStyle}>
                                                <FontAwesomeIcon icon={faList} style={iconStyle} />
                                                Category
                                            </Form.Label>
                                            <Form.Select required style={inputStyle} onChange={handleCategoryChange}>
                                                <option value="">Select Category</option>
                                                {categories.map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                            {isCustomCategory && (
                                                <>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter new category"
                                                        value={customCategory}
                                                        onChange={handleCustomCategoryChange}
                                                        style={inputStyle}
                                                        className="mt-2"
                                                    />
                                                    <Button
                                                        variant="secondary"
                                                        className="mt-2"
                                                        onClick={addCustomCategory}
                                                        style={{ backgroundColor: '#4A90E2', border: 'none' }}
                                                    >
                                                        Add Category
                                                    </Button>
                                                </>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="incomeDate">
                                            <Form.Label style={labelStyle}>
                                                <FontAwesomeIcon icon={faCalendar} style={iconStyle} />
                                                Date
                                            </Form.Label>
                                            <Form.Control type="date" defaultValue={new Date().toISOString().split('T')[0]} required style={inputStyle} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="incomeTags">
                                            <Form.Label style={labelStyle}>
                                                <FontAwesomeIcon icon={faTags} style={iconStyle} />
                                                Tags (Optional)
                                            </Form.Label>
                                            <Form.Control type="text" placeholder="Add tags to categorize the income" style={inputStyle} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="incomeDescription">
                                    <Form.Label style={labelStyle}>
                                        <FontAwesomeIcon icon={faFileAlt} style={iconStyle} />
                                        Description (Optional)
                                    </Form.Label>
                                    <Form.Control as="textarea" rows={3} placeholder="Enter a brief description of the income" style={inputStyle} />
                                </Form.Group>

                                {/* <Form.Group className="mb-4" controlId="incomeReceipt">
                                    <Form.Label style={labelStyle}>
                                        <FontAwesomeIcon icon={faReceipt} style={iconStyle} />
                                        Upload Receipt (Optional)
                                    </Form.Label>
                                    <Form.Control type="file" accept=".pdf,.png,.jpg" style={inputStyle} />
                                </Form.Group> */}

                                <div className="d-grid">
                                    <Button variant="primary" type="submit" size="lg" style={{ backgroundColor: '#4A90E2', border: 'none' }}>
                                        Add Income
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AddIncome;
