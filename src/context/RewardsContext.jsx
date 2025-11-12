import React, { createContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '../logger';


export const RewardsContext = createContext();

export function RewardsProvider({ children }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  const [filterMonth, setFilterMonth] = useState('October');
  const [filterYear, setFilterYear] = useState(2024);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectCustomer = useCallback((customer) => {
    logger.info('Context: Customer selected', {
      customerId: customer?.id,
      customerName: customer?.name,
    });
    setSelectedCustomer(customer);
    setSelectedMonth(null);
    setError(null);
  }, []);

  const handleSelectMonth = useCallback((month) => {
    logger.info('Context: Month selected', { month });
    setSelectedMonth(month);
  }, []);

  const handleFilterChange = useCallback((month, year) => {
    logger.info('Context: Filters applied', { month, year });
    setFilterMonth(month);
    setFilterYear(year);
  }, []);


  const handleClearSelection = useCallback(() => {
    logger.info('Context: Selection cleared');
    setSelectedCustomer(null);
    setSelectedMonth(null);
    setError(null);
  }, []);

  const handleClearError = useCallback(() => {
    logger.debug('Context: Error cleared');
    setError(null);
  }, []);

  const value = {
    selectedCustomer,
    selectedMonth,
    filterMonth,
    filterYear,
    loading,
    error,
    
    handleSelectCustomer,
    handleSelectMonth,
    handleFilterChange,
    handleClearSelection,
    handleClearError,
    
    setLoading,
    setError,
    setSelectedCustomer,
    setSelectedMonth,
    setFilterMonth,
    setFilterYear,
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
}

RewardsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useRewards() {
  const context = React.useContext(RewardsContext);
  
  if (!context) {
    logger.error('useRewards hook used outside RewardsProvider');
    throw new Error('useRewards must be used within RewardsProvider');
  }
  
  return context;
}