
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import logger from '../logger';
import { useRewardsCalculation } from '../hooks/useRewardsCalculation';
import { getMonthName } from '../utils/dateFormatter';
import { calculateRewardsByMonth } from '../utils/rewardsCalculator';
import { MONTHS } from '../utils/constants';

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
    margin: 20px auto;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CustomerName = styled.h1`
  font-size: 32px;
  color: #333;
  margin: 0;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 24px;
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

  &:hover {
    background-color: #e0e0e0;
    border-color: #999;
    transform: translateX(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 150px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px;
  }
`;

const ResetButton = styled.button`
  background-color: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: #764ba2;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

const TotalPointsContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 40px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  text-align: center;

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 30px;
  }
`;

const TotalLabel = styled.p`
  font-size: 16px;
  margin: 0 0 10px 0;
  opacity: 0.9;
  font-weight: 500;
`;

const TotalPoints = styled.p`
  font-size: 48px;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const RewardCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }

  @media (max-width: 768px) {
    padding: 20px;

    &:hover {
      transform: translateY(-4px);
    }
  }
`;

const MonthLabel = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const MonthTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin: 0 0 15px 0;
  font-weight: 600;
`;

const PointsValue = styled.p`
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
  margin: 0;
`;

const TransactionCount = styled.p`
  font-size: 12px;
  color: #999;
  margin: 10px 0 0 0;
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

const RewardsDisplay = ({
  customer,
  transactions = [],
  onMonthClick,
  onBack,
  selectedMonth,
  selectedYear,
  onMonthFilterChange,
  months = [],
  years = [],
  loading = false,
  error = null,
  lastThreeMonths = []
}) => {
  logger.info('RewardsDisplay component rendered', {
    customerId: customer?.id,
    transactionCount: transactions.length,
    selectedMonth,
    selectedYear,
    lastThreeMonths: lastThreeMonths.length
  });

  const [isLastThreeMonthsSelected, setIsLastThreeMonthsSelected] = useState(false);

  const displayedRewards = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      logger.warn('No transactions provided');
      return [];
    }

    logger.info('Calculating rewards for display', {
      selectedMonth,
      selectedYear,
      isLastThreeMonths: isLastThreeMonthsSelected || (!selectedMonth && !selectedYear)
    });

    if (isLastThreeMonthsSelected || (!selectedMonth && !selectedYear)) {
      if (lastThreeMonths.length === 0) {
        return [];
      }

      const filteredTxns = transactions.filter(txn => {
        const txDate = new Date(txn.date);
        const txMonth = months[txDate.getMonth()];
        const txYear = txDate.getFullYear();

        return lastThreeMonths.some(
          m => m.monthName === txMonth && m.year === txYear
        );
      });

      logger.info('Calculated rewards for last 3 months', {
        filteredCount: filteredTxns.length,
        totalTransactions: transactions.length
      });

      return calculateRewardsByMonth(filteredTxns);
    }

    const filteredTxns = transactions.filter(txn => {
      const txDate = new Date(txn.date);
      const txMonth = txDate.getMonth();
      const txYear = txDate.getFullYear();
      const selectedMonthNum = months.indexOf(selectedMonth);

      const matches = txMonth === selectedMonthNum && txYear === selectedYear;
      
      if (matches) {
        logger.debug('Transaction matches filter', {
          transactionDate: txn.date,
          selectedMonth,
          selectedYear
        });
      }

      return matches;
    });

    logger.info('Calculated rewards for selected period', {
      selectedMonth,
      selectedYear,
      filteredCount: filteredTxns.length,
      totalTransactions: transactions.length
    });

    return calculateRewardsByMonth(filteredTxns);
  }, [transactions, selectedMonth, selectedYear, months, lastThreeMonths, isLastThreeMonthsSelected]);

  const totalPoints = useMemo(() => {
    return displayedRewards.reduce((sum, reward) => sum + reward.points, 0);
  }, [displayedRewards]);

  const handleMonthCardClick = useCallback((monthData) => {
    logger.info('Month card clicked', {
      month: monthData.month,
      points: monthData.points
    });
    onMonthClick(monthData);
  }, [onMonthClick]);

  const handleLastThreeMonthsSelect = useCallback(() => {
    logger.info('Last 3 months selected');
    setIsLastThreeMonthsSelected(true);
    onMonthFilterChange('', null);
  }, [onMonthFilterChange]);

  const handleMonthChange = useCallback((event) => {
    const value = event.target.value;
    
    if (value === 'LAST_THREE_MONTHS') {
      logger.info('Last 3 months option selected from dropdown');
      handleLastThreeMonthsSelect();
    } else {
      logger.info('Month filter changed', { month: value });
      setIsLastThreeMonthsSelected(false);
      onMonthFilterChange(value, selectedYear);
    }
  }, [onMonthFilterChange, selectedYear, handleLastThreeMonthsSelect]);

  const handleYearChange = useCallback((event) => {
    const year = parseInt(event.target.value);
    logger.info('Year filter changed', { year });
    setIsLastThreeMonthsSelected(false);
    onMonthFilterChange(selectedMonth, year);
  }, [onMonthFilterChange, selectedMonth]);

  const handleReset = useCallback(() => {
    logger.info('Reset filters to last 3 months');
    setIsLastThreeMonthsSelected(true);
    onMonthFilterChange('', null);
  }, [onMonthFilterChange]);

  if (loading) {
    return (
      <Container>
        <NoDataMessage>
          <p>Loading rewards data...</p>
        </NoDataMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <NoDataMessage>
          <p>Error: {error}</p>
        </NoDataMessage>
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container>
        <NoDataMessage>
          <p>Please select a customer to view rewards.</p>
        </NoDataMessage>
      </Container>
    );
  }

  const periodLabel = isLastThreeMonthsSelected || (!selectedMonth && !selectedYear)
    ? 'Last 3 Months'
    : `${selectedMonth} ${selectedYear}`;

  return (
    <Container>
      <Header>
        <div>
          <CustomerName>{customer.name}</CustomerName>
          <p style={{ color: '#999', margin: '5px 0 0 0' }}>
            Customer ID: {customer.id}
          </p>
        </div>
        <BackButton onClick={onBack}>
          ← Back to Customers
        </BackButton>
      </Header>

      <FilterContainer>
        <FilterGroup>
          <FilterLabel htmlFor="period-select">Period</FilterLabel>
          <FilterSelect
            id="period-select"
            value={isLastThreeMonthsSelected ? 'LAST_THREE_MONTHS' : 'SPECIFIC'}
            onChange={(e) => {
              if (e.target.value === 'LAST_THREE_MONTHS') {
                handleLastThreeMonthsSelect();
              } else {
                setIsLastThreeMonthsSelected(false);
              }
            }}
          >
            <option value="LAST_THREE_MONTHS">📅 Last 3 Months</option>
            <option value="SPECIFIC">📌 Select Specific Month</option>
          </FilterSelect>
        </FilterGroup>

        {!isLastThreeMonthsSelected && (
          <>
            <FilterGroup>
              <FilterLabel htmlFor="month-select">Month</FilterLabel>
              <FilterSelect
                id="month-select"
                value={selectedMonth || ''}
                onChange={handleMonthChange}
              >
                <option value="">-- Select Month --</option>
                {months.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel htmlFor="year-select">Year</FilterLabel>
              <FilterSelect
                id="year-select"
                value={selectedYear || ''}
                onChange={handleYearChange}
              >
                <option value="">-- Select Year --</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          </>
        )}

        <ResetButton onClick={handleReset}>
          Reset to Last 3 Months
        </ResetButton>
      </FilterContainer>

      <TotalPointsContainer>
        <TotalLabel>Rewards Points ({periodLabel})</TotalLabel>
        <TotalPoints>{totalPoints.toLocaleString()}</TotalPoints>
      </TotalPointsContainer>

      {displayedRewards.length > 0 ? (
        <CardsContainer>
          {displayedRewards.map((reward, index) => {
            const [year, monthNum] = reward.month.split('-');
            const monthName = getMonthName(parseInt(monthNum));

            return (
              <RewardCard
                key={index}
                onClick={() => handleMonthCardClick(reward)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleMonthCardClick(reward);
                  }
                }}
              >
                <MonthLabel>{year}</MonthLabel>
                <MonthTitle>{monthName}</MonthTitle>
                <PointsValue>{reward.points.toLocaleString()}</PointsValue>
                <TransactionCount>
                  {reward.transactionCount || 0} transaction(s)
                </TransactionCount>
              </RewardCard>
            );
          })}
        </CardsContainer>
      ) : (
        <NoDataMessage>
          <p>No transactions found for {periodLabel}</p>
        </NoDataMessage>
      )}
    </Container>
  );
};

RewardsDisplay.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    totalPoints: PropTypes.number
  }),
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      customerId: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired
    })
  ),
  onMonthClick: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string,
  selectedYear: PropTypes.number,
  onMonthFilterChange: PropTypes.func.isRequired,
  months: PropTypes.arrayOf(PropTypes.string),
  years: PropTypes.arrayOf(PropTypes.number),
  loading: PropTypes.bool,
  error: PropTypes.string,
  lastThreeMonths: PropTypes.arrayOf(
    PropTypes.shape({
      monthName: PropTypes.string,
      year: PropTypes.number
    })
  )
};

export default RewardsDisplay;
