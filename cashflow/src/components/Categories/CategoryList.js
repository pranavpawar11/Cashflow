import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faPencilAlt, faInfoCircle, faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import '../../css/categories.css'

const CategoryList = (props) => {
  const [showTooltip, setShowTooltip] = useState({});
  const isMobile = window.innerWidth <= 768;

  const toggleTooltip = (category) => {
    setShowTooltip(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const isBudgetExceeded = (category) => {
    const used = props.usedBudget[category.category] || 0;
    return used > category.limit;
  };

  const renderTooltip = (category) => (
    <Tooltip id={`tooltip-${category.category}`}>
      <strong>Budget:</strong> {category.limit || 0}<br />
      <strong>Used:</strong> {props.usedBudget[category.category] || 0}
      {isBudgetExceeded(category) === true ? (
        <div className="text-warning mt-1">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
          Budget exceeded!
        </div>
      ) : (
        <div className="text-success mt-1">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
          Budget in control!
        </div>
      )}
    </Tooltip>
  );

  return (
    <ul className="list-unstyled">
      {props.categories.filter(category => category.category !== 'Other').map((category) => (
        <li
          key={category.category}
          className={`d-flex flex-column bg-light p-3 mb-3 rounded shadow-sm ${isMobile ? 'mobile-list-item' : ''}`}
        >
          <div className="category-main-list">
            <div className="cat-icon d-flex align-items-center">
              <FontAwesomeIcon
                icon={faTags}
                className={`me-2 ${props.type === 'expense' ? 'text-secondary' : 'text-primary'}`}
              />
              <span className="fw-medium">{category.category}</span>
            </div>
            <div className='category-sub-list'>
              {!isMobile && props.type === 'expense' && (
                <div className="cat-info d-flex align-items-center mx-4">
                  <span className={`me-4 ${isBudgetExceeded(category) ? 'text-warning' : ''}`}>
                    <small className="text-muted me-1">Budget:</small>
                    <span className="fw-semibold">₹{category.limit || 0}</span>
                  </span>
                  <span className={`${isBudgetExceeded(category) ? 'text-warning' : ''}`}>
                    <small className="text-muted me-1">Used:</small>
                    <span className="fw-semibold">₹{props.usedBudget[category.category] || 0}</span>
                  </span>
                  {/* {isBudgetExceeded(category) && (
                    <FontAwesomeIcon icon={faExclamationTriangle} className="ms-2 text-warning" />
                  )} */}
                </div>
              )}
              <div className="cat-buttons d-flex">
                {props.type === 'expense' && (
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip(category)}
                    trigger={['hover', 'focus']}
                    show={showTooltip[category.category]}
                  >
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 me-2"
                      onClick={() => toggleTooltip(category.category)}
                    >
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className={isBudgetExceeded(category) ? 'text-warning' : 'text-info'}
                      />
                    </Button>
                  </OverlayTrigger>
                )}
                { props.type === 'expense' && (<Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => props.handleDisplayModal(category, props.usedBudget[category.category] || 0)}
                >
                  <FontAwesomeIcon icon={faPencilAlt} className="me-1" />
                  {isMobile ? 'Details' : 'Edit'}
                </Button>)}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => props.handleDeleteCategory(category.category, props.type)}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-1" />
                  {!isMobile && 'Delete'}
                </Button>
              </div>
            </div>
          </div>
          {isMobile && props.type === 'expense' && (
            <div className="d-flex justify-content-between mt-2">
              <small className="text-muted">
                Budget: <span className="fw-semibold">₹{category.limit || 0}</span>
              </small>
              <small className={`${isBudgetExceeded(category) ? 'text-warning' : 'text-muted'}`}>
                Used: <span className="fw-semibold">₹{props.usedBudget[category.category] || 0}</span>
              </small>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
