import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import CategoryList from './CategoryList';  // Ensure this is the correct path

const CategoriesTabs = (props) => {
  return (
    <Tabs defaultActiveKey="expense" className="mb-4 sticky-tabs">
      <Tab eventKey="expense" title={<span className={`tab-item ${props.categoryType === 'expense' ? 'tab-item-active' : 'tab-item-inactive'}`}>Expense</span>}>
        <CategoryList
          categories={props.expenseCategories}
          type="expense"
          handleDisplayModal={props.handleDisplayModal}
          handleDeleteCategory={props.handleDeleteCategory}
          usedBudget={props.usedBudget}
        />
      </Tab>
      <Tab eventKey="income" title={<span className={`tab-item ${props.categoryType === 'income' ? 'tab-item-active' : 'tab-item-inactive'}`}>Income</span>}>
        <CategoryList
          categories={props.incomeCategories}
          type="income"
          handleDisplayModal={props.handleDisplayModal}
          handleDeleteCategory={props.handleDeleteCategory}
        />
      </Tab>
    </Tabs>
  );
};

export default CategoriesTabs;
