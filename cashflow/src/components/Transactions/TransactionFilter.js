import React, { useState } from 'react';
import { Button, Dropdown, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import '../../css/transactionFilter.css';
function TransactionFilter({ 
    selectedMonth, 
    handlePreviousMonth, 
    handleNextMonth, 
    handleFilterChange, 
    handleSortChange,
    handleSearch,
    expenseCategories 
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const onSearchChange = (e) => {
        setSearchTerm(e.target.value);
        handleSearch(e.target.value);
    };

    return (
        <div className="filter-month-container mb-3">
            <Row className="d-flex w-100 align-items-center justify-content-between">
                <Col xs={12} md={4} className="mb-1 mb-md-0">
                    <div className="month-buttons d-flex justify-content-between align-items-center">
                        <Button variant="outline-secondary" onClick={handlePreviousMonth}>
                            <FaChevronLeft />
                        </Button>
                        <h3 className="mb-0 mx-2 selected-month">{selectedMonth.slice(0, 3) + " " + selectedMonth.split(" ")[1]}</h3>
                        <Button variant="outline-secondary" onClick={handleNextMonth}>
                            <FaChevronRight />
                        </Button>
                    </div>
                </Col>
                <Col xs={12} md={8} className="month-buttons d-flex justify-content-around align-items-center">
                    <Row className="filter-options align-items-center d-flex justify-content-between">
                        <Col xs={12} sm={4} className="filter-options-amount mb-2 mb-sm-0">
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-dark" id="dropdown-filter" className="w-100">
                                    <FaFilter className="mr-2" /> Filter
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleFilterChange('')}>All</Dropdown.Item>
                                    {expenseCategories.map((cat, index) => (
                                        <Dropdown.Item key={index} onClick={() => handleFilterChange(cat.category)}>
                                            {cat.category}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col xs={12} sm={4} className="filter-options-amount mb-2 mb-sm-0">
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-dark" id="dropdown-sort" className="w-100">
                                    <FaSort className="mr-2" /> Sort
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleSortChange('amount', 'asc')}>Amount (Low to High)</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSortChange('amount', 'desc')}>Amount (High to Low)</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSortChange('date', 'asc')}>Date (Oldest First)</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSortChange('date', 'desc')}>Date (Newest First)</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col xs={12} sm={4} className='search-main' >
                            <InputGroup className='search-bar'>
                                <InputGroup.Text  > 
                                    <FaSearch className='ser'/>
                                </InputGroup.Text>
                                <FormControl
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={onSearchChange}
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default TransactionFilter;