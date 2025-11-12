import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MONTHS, YEARS } from '../utils/constants';
import logger from '../logger';

/**
 * Styled Components
 */
const FilterContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 150px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Select = styled.select`
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
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
    width: 100%;
  }
`;

const ResetButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  height: fit-content;
  margin-top: auto;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 8px;
  }
`;

function FilterBar({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onReset,
}) {
  useEffect(() => {
    logger.info('FilterBar: Component rendered', {
      selectedMonth,
      selectedYear,
    });
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    const month = e.target.value;
    logger.debug('FilterBar: Month changed', { month });
    onMonthChange(month);
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value, 10);
    logger.debug('FilterBar: Year changed', { year });
    onYearChange(year);
  };

  const handleReset = () => {
    logger.info('FilterBar: Filters reset');
    onReset();
  };

  return (
    <FilterContainer>
      <FilterGroup>
        <Label htmlFor="month-select">Month</Label>
        <Select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {MONTHS.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Label htmlFor="year-select">Year</Label>
        <Select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <ResetButton onClick={handleReset}>Reset Filters</ResetButton>
    </FilterContainer>
  );
}

FilterBar.propTypes = {
  selectedMonth: PropTypes.string.isRequired,
  selectedYear: PropTypes.number.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default FilterBar;