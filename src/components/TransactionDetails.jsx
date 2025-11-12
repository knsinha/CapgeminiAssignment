
import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import logger from '../logger';
import { calculateRewards } from '../utils/rewardsCalculator';
import { filterTransactionsByMonthYear } from '../utils/rewardsCalculator';
import { formatDate, getMonthName } from '../utils/dateFormatter';
import { ITEMS_PER_PAGE, MONTHS } from '../utils/constants';

// Styled Components (same as before)
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    align-items: flex-end;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    max-height: 80vh;
    border-radius: 12px 12px 0 0;
    max-width: 100%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const ModalBody = styled.div`
  padding: 25px;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const SummaryLabel = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0 0 5px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const SummaryValue = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const TableHeader = styled.thead`
  background: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f9f9f9;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 16px;
  text-align: left;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const PointsCell = styled(TableCell)`
  font-weight: 600;
  color: #667eea;
  font-size: 15px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#667eea' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid ${props => props.active ? '#667eea' : '#ddd'};
  padding: 8px 12px;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: ${props => props.active ? '600' : '400'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.3s ease;
  font-size: 12px;

  &:hover:not(:disabled) {
    background-color: #667eea;
    color: white;
    border-color: #667eea;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #666;

  p {
    font-size: 16px;
    margin: 0;
  }
`;

const BackButton = styled.button`
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: #e0e0e0;
    border-color: #999;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

const TransactionDetails = ({
  month,
  monthData,
  transactions = [],
  onClose,
  isOpen = false,
  selectedMonth = '',
  selectedYear = null
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  logger.info('TransactionDetails component rendered', {
    month,
    selectedMonth,
    selectedYear,
    transactionCount: transactions.length,
    isOpen
  });

  useEffect(() => {
    if (!selectedMonth || !selectedYear || !transactions.length) {
      logger.warn('TransactionDetails: Missing required filter parameters', {
        selectedMonth,
        selectedYear,
        transactionCount: transactions.length
      });
      setFilteredTransactions([]);
      setCurrentPage(1);
      return;
    }

    try {
      logger.info('TransactionDetails: Applying month/year filter', {
        month: selectedMonth,
        year: selectedYear,
        totalTransactions: transactions.length
      });

      const filtered = filterTransactionsByMonthYear(
        transactions,
        selectedMonth,
        selectedYear
      );

      logger.info('TransactionDetails: Filtered results', {
        filteredCount: filtered.length,
        originalCount: transactions.length
      });

      setFilteredTransactions(filtered);
      setCurrentPage(1); 
    } catch (error) {
      logger.error('TransactionDetails: Error filtering transactions', {
        error: error.message,
        selectedMonth,
        selectedYear
      });
      setFilteredTransactions([]);
    }
  }, [selectedMonth, selectedYear, transactions]);

  const itemsPerPage = ITEMS_PER_PAGE.transactions || 10;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const totalPoints = filteredTransactions.reduce((sum, transaction) => {
    return sum + calculateRewards(transaction.amount);
  }, 0);

  const handleClose = () => {
    logger.info('Transaction details modal closed');
    setCurrentPage(1);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const monthName = selectedMonth && selectedYear
    ? `${selectedMonth} \${selectedYear}`
    : month || 'Transactions';

  return (
    <Modal onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{monthName} - Transactions</ModalTitle>
          <CloseButton onClick={handleClose} aria-label="Close modal">
            ✕
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <SummaryContainer>
            <SummaryCard>
              <SummaryLabel>Total Transactions</SummaryLabel>
              <SummaryValue>{filteredTransactions.length}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Total Amount</SummaryLabel>
              <SummaryValue>
                \${filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Total Points</SummaryLabel>
              <SummaryValue>{totalPoints.toLocaleString()}</SummaryValue>
            </SummaryCard>
          </SummaryContainer>

          {filteredTransactions.length > 0 ? (
            <>
              <TableContainer>
                <StyledTable>
                  <TableHeader>
                    <tr>
                      <TableHeaderCell>Transaction ID</TableHeaderCell>
                      <TableHeaderCell>Amount</TableHeaderCell>
                      <TableHeaderCell>Date</TableHeaderCell>
                      <TableHeaderCell>Points Earned</TableHeaderCell>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {paginatedTransactions.map((transaction) => {
                      const points = calculateRewards(transaction.amount);
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>\${transaction.amount.toFixed(2)}</TableCell>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <PointsCell>{points.toLocaleString()}</PointsCell>
                        </TableRow>
                      );
                    })}
                  </tbody>
                </StyledTable>
              </TableContainer>

              {totalPages > 1 && (
                <PaginationContainer>
                  <PageButton
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    ← Previous
                  </PageButton>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PageButton
                      key={page}
                      active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Go to page \${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </PageButton>
                  ))}

                  <PageButton
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    Next →
                  </PageButton>
                </PaginationContainer>
              )}

              <div style={{
                textAlign: 'center',
                color: '#666',
                fontSize: '13px',
                marginTop: '15px'
              }}>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
            </>
          ) : (
            <NoDataMessage>
              <p>
                {!selectedMonth || !selectedYear
                  ? 'Please select a month and year to view transactions'
                  : `No transactions found for \${selectedMonth} \${selectedYear}`}
              </p>
            </NoDataMessage>
          )}

          <BackButton onClick={handleClose}>
            ← Back to Rewards
          </BackButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

TransactionDetails.propTypes = {
  month: PropTypes.string,
  monthData: PropTypes.shape({
    month: PropTypes.string,
    points: PropTypes.number,
    transactionCount: PropTypes.number
  }),
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      customerId: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired
    })
  ),
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  selectedMonth: PropTypes.string,
  selectedYear: PropTypes.number
};

export default TransactionDetails;