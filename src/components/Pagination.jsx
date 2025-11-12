import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import logger from '../logger';

/**
 * Styled Components
 */
const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PaginationInfo = styled.span`
  color: #666;
  font-size: 14px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: 2px solid #667eea;
  background: ${(props) => (props.active ? '#667eea' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#667eea')};
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover:not(:disabled) {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) {
  const handlePreviousPage = () => {
    logger.debug('Pagination: Previous page clicked', {
      from: currentPage,
      to: currentPage - 1,
    });
    onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    logger.debug('Pagination: Next page clicked', {
      from: currentPage,
      to: currentPage + 1,
    });
    onPageChange(currentPage + 1);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <PaginationContainer>
      <PaginationInfo>
        Showing {startItem} - {endItem} of {totalItems} items
      </PaginationInfo>

      <ButtonGroup>
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          ← Previous
        </Button>

        <Button active>
          {currentPage} / {totalPages}
        </Button>

        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next →
        </Button>
      </ButtonGroup>
    </PaginationContainer>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
};

export default Pagination;