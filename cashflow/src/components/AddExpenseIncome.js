import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign, faList, faCalendar, faFileAlt, faTags } from '@fortawesome/free-solid-svg-icons';
import ExpenseContext from '../context/expenseContext';

function AddExpenseIncome(props) {
    const context = useContext(ExpenseContext);
    // eslint-disable-next-line
    const { addnewTransaction, fetchCategories, allCategory, addNewCategory, expenseCategories, incomeCategories } = context;



    // let initialCategories = props.type === 'Expense' ? ['Other', 'Food', 'Entertainment', 'Bills'] : ['Salary', 'Investments', 'Gifts', 'Other'];

    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [Allcategories, setNewCategories] = useState([]);
    const [customCategory, setCustomCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tag, setTags] = useState('');
    const [description, setDescription] = useState('');
    // eslint-disable-next-line
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        // const fetchAndSetCategories = async () => {
        //     await fetchCategories();

        //     if (allCategory && allCategory.length > 0 && allCategory[0].expense) {
        //         const initialCategories = props.type === 'expense' ? allCategory[0].expense : allCategory[0].income;
        //         setNewCategories(initialCategories);
        //         // console.log(allCategory[0]['expense']);
        //     }
        // };
        const categories = props.type === 'income' ? incomeCategories : expenseCategories;
        setNewCategories(categories)
        // fetchAndSetCategories();
        //eslint-disable-next-line 
    }, [props.type, fetchCategories]);

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === 'Other') {
            setIsCustomCategory(true);
        } else {
            setIsCustomCategory(false);
            setCustomCategory('');
        }
        setCategory(value);
    };


    // const addCustomCategory = () => {
    //     if (customCategory && !categories.includes(customCategory)) {
    //         setNewCategories([...categories, customCategory]);
    //         setIsCustomCategory(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !category) {
            return;
        } else {
            const transactionData = {
                type: props.type === "expense" ? "Expense" : "Income",
                amount,
                category: category === 'Other' ? customCategory : category,
                date,
                tag: tag === "" ? "General" : tag,
                description
            };
            addnewTransaction(transactionData);

            setAmount('');
            setCategory('');
            setDate(new Date().toISOString().split('T')[0]);
            setTags('');
            setDescription('');
        }
    };

    return (
        <Container fluid className='py-4' style={{ height: 'auto', backgroundColor: '#F0F0F0' }}>
            <Row className="justify-content-center">
                <Col xs={12} lg={10} xl={8}>
                    <Card style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
                        <Card.Body>
                            <h2 className="text-center mb-4" style={{ color: '#4A90E2' }}>Add New {props.type}</h2>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId={props.type + "amount"}>
                                            <Form.Label style={{ color: '#4A4A4A', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                                <FontAwesomeIcon icon={faIndianRupeeSign} style={{ color: '#4A90E2', marginRight: '0.5rem' }} />
                                                {props.type} Amount
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter amount"
                                                required
                                                style={{ backgroundColor: '#F5F7FA', border: '1px solid #B7B7B7', borderRadius: '4px', color: '#4A4A4A' }}
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId={props.type + "Category"}>
                                            <Form.Label style={{ color: '#4A4A4A', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                                <FontAwesomeIcon icon={faList} style={{ color: '#4A90E2', marginRight: '0.5rem' }} />
                                                Category
                                            </Form.Label>
                                            <Form.Select required
                                                style={{ backgroundColor: '#F5F7FA', border: '1px solid #B7B7B7', borderRadius: '4px', color: '#4A4A4A' }}
                                                value={category}
                                                onChange={handleCategoryChange}
                                            >
                                                <option value="">Select Category</option>
                                                {/* {console.log(Allcategories)} */}
                                                {

                                                    Allcategories.length > 0 && Allcategories.map((cat) => (
                                                        <option key={cat.category} value={cat.category}>{cat.category}</option>
                                                    ))}
                                            </Form.Select>
                                            {isCustomCategory && (
                                                <>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter new category"
                                                        value={customCategory}
                                                        onChange={(e) => setCustomCategory(e.target.value)}
                                                        style={{ backgroundColor: '#F5F7FA', border: '1px solid #B7B7B7', borderRadius: '4px', color: '#4A4A4A' }}
                                                        className="mt-2"
                                                    />
                                                    <Button
                                                        variant="secondary"
                                                        className="mt-2"
                                                        // onClick={addCustomCategory}
                                                        style={{ backgroundColor: '#4A90E2', border: 'none' }}
                                                        onClick={async () => await addNewCategory(customCategory, props.type)}
                                                        disabled={customCategory <= 1}
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
                                        <Form.Group className="mb-3" controlId={props.type + "Date"}>
                                            <Form.Label style={{ color: '#4A4A4A', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                                <FontAwesomeIcon icon={faCalendar} style={{ color: '#4A90E2', marginRight: '0.5rem' }} />
                                                Date
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                required
                                                style={{ backgroundColor: '#F5F7FA', border: '1px solid #B7B7B7', borderRadius: '4px', color: '#4A4A4A' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId={props.type + "Tags"}>
                                            <Form.Label style={{ color: '#4A4A4A', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                                <FontAwesomeIcon icon={faTags} style={{ color: '#4A90E2', marginRight: '0.5rem' }} />
                                                Tags (Optional)
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder={"Add tags to categorize the " + props.type}
                                                value={tag}
                                                onChange={(e) => setTags(e.target.value)}
                                                style={{ backgroundColor: '#F5F7FA', border: '1px solid #B7B7B7', borderRadius: '4px', color: '#4A4A4A' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId={props.type + "Description"}>
                                    <Form.Label style={{ color: '#4A4A4A', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                        <FontAwesomeIcon icon={faFileAlt} style={{ color: '#4A90E2', marginRight: '0.5rem' }} />
                                        Description (Optional)
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder={"Enter a brief description of the " + props.type}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ backgroundColor: '#F5F7FA', border: '1px solid #B7B7B7', borderRadius: '4px', color: '#4A4A4A' }}
                                    />
                                </Form.Group>

                                {/* <Form.Group className="mb-4" controlId="expenseReceipt">
                                    <Form.Label style={{ color: '#4A4A4A', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                        <FontAwesomeIcon icon={faReceipt} style={{ color: '#4A90E2', marginRight: '0.5rem' }} />
                                        Upload Receipt (Optional)
                                    </Form.Label>
                                    <Form.Control type="file" accept=".pdf,.png,.jpg" style={{ backgroundColor: '#F5F7FA', border: '1px solid #B7B7B7', borderRadius: '4px', color: '#4A4A4A' }} />
                                </Form.Group> */}

                                {alert && <div className="alert alert-info" role="alert">{alert}</div>}

                                <div className="d-grid">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="lg"
                                        style={{ backgroundColor: '#4A90E2', border: 'none' }}
                                    >
                                        Add {props.type}
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

export default AddExpenseIncome;
