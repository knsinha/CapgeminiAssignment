import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { usePagination } from '../hooks/usePagination';
import { ITEMS_PER_PAGE, TABLE_HEADERS, CURRENCY_SYMBOL } from '../utils/constants';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import logger from '../logger';

/**
 * Styled Components
 */
const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Arial', sans-serif;

  thead {
    background-color: #667eea;
    color: white;
  }

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  td {
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
  }

  tbody tr {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f5f5f5;
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 12px;
      font-size: 14px;
    }
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

function CustomerList({ customers = [], onSelectCustomer, loading = false }) {
  const pagination = usePagination(customers, ITEMS_PER_PAGE.customers);
  const { currentItems, currentPage, totalPages, goToPage } = pagination;

  useEffect(() => {
    logger.info('CustomerList: Component mounted', {
      customerCount: customers.length,
    });
  }, [customers.length]);

  if (loading) {
    return <LoadingSpinner message="Loading customers..." />;
  }

  if (customers.length === 0) {
    return <EmptyMessage>No customers available</EmptyMessage>;
  }

  const handleSelectClick = (customer) => {
    logger.info('CustomerList: View Details clicked', {
      customerId: customer.id,
      customerName: customer.name,
    });
    onSelectCustomer(customer);
  };

  return (
    <>
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>{TABLE_HEADERS.CUSTOMER_ID}</th>
              <th>{TABLE_HEADERS.CUSTOMER_NAME}</th>
              <th>{TABLE_HEADERS.TOTAL_POINTS}</th>
              <th>{TABLE_HEADERS.ACTIONS}</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.totalPoints || 0}</td>
                <td>
                  <ActionButton
                    onClick={() => handleSelectClick(customer)}
                  >
                    View Details
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        itemsPerPage={ITEMS_PER_PAGE.customers}
        totalItems={customers.length}
      />
    </>
  );
}

CustomerList.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
      totalPoints: PropTypes.number,
    })
  ),
  onSelectCustomer: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

CustomerList.defaultProps = {
  customers: [],
  loading: false,
};

export default CustomerList;