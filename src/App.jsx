import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import logger from './logger';
import { fetchCustomers, fetchTransactions } from './services/apiService';
import { MONTHS, YEARS } from './utils/constants';
import { RewardsProvider, RewardsContext } from './context/RewardsContext';
import CustomerList from './components/CustomerList';
import RewardsDisplay from './components/RewardsDisplay';
import TransactionDetails from './components/TransactionDetails';

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);

  h1 {
    margin: 0;
    font-size: 36px;
    font-weight: 700;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  }

  p {
    margin: 10px 0 0 0;
    opacity: 0.9;
    font-size: 16px;
  }
`;

const MainContainer = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const ContentArea = styled.div`
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Footer = styled.footer`
  background-color: #f9f9f9;
  color: #666;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid #c33;
`;

function AppContent() {
  const context = useContext(RewardsContext);
  const {
    selectedCustomer,
    filterMonth,
    filterYear,
    showTransactionDetails,
    loading,
    error,
    handleSelectCustomer,
    handleSelectMonth,
    handleFilterChange,
    handleCloseTransactionDetails,
    setLoading,
    setError,
  } = context;

  // Local state
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [allCustomerTransactions, setAllCustomerTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getLastThreeMonths = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = MONTHS[date.getMonth()];
      const year = date.getFullYear();
      months.push({ monthName, year });
    }
    
    return months;
  };

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        logger.info('App: Loading customers');
        setLoading(true);
        setError(null);

        const customersData = await fetchCustomers();
        setCustomers(customersData);
        logger.info('App: Customers loaded', { count: customersData.length });
      } catch (err) {
        logger.error('App: Error loading customers', { error: err.message });
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [setLoading, setError]);

  useEffect(() => {
    if (!selectedCustomer) {
      setTransactions([]);
      setAllCustomerTransactions([]);
      return;
    }

    const loadTransactions = async () => {
      try {
        logger.info('App: Loading transactions for customer', {
          customerId: selectedCustomer.id
        });
        setLoading(true);
        setError(null);

        const txData = await fetchTransactions(selectedCustomer.id);
        
        setAllCustomerTransactions(txData);
        setTransactions(txData);
        
        logger.info('App: Transactions loaded', { 
          count: txData.length,
          customerId: selectedCustomer.id 
        });

        const lastThree = getLastThreeMonths();
        if (lastThree.length > 0) {
          const firstMonth = lastThree[0].monthName;
          const firstYear = lastThree[0].year;
          
          logger.info('App: Setting default to last 3 months', {
            firstMonth,
            firstYear
          });
          
          handleFilterChange(firstMonth, firstYear);
        }
      } catch (err) {
        logger.error('App: Error loading transactions', {
          customerId: selectedCustomer.id,
          error: err.message
        });
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [selectedCustomer, setLoading, setError, handleFilterChange]);

  if (!selectedCustomer) {
    return (
      <>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
        <CustomerList
          customers={customers}
          onSelectCustomer={handleSelectCustomer}
          loading={loading}
          currentPage={currentPage}
          itemsPerPage={5}
          onPageChange={setCurrentPage}
        />
      </>
    );
  }

  return (
    <>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      <RewardsDisplay
        customer={selectedCustomer}
        transactions={allCustomerTransactions}
        onMonthClick={handleSelectMonth}
        onBack={() => handleSelectCustomer(null)}
        selectedMonth={filterMonth}
        selectedYear={filterYear}
        onMonthFilterChange={handleFilterChange}
        months={MONTHS}
        years={YEARS}
        loading={loading}
        error={error?.message}
        lastThreeMonths={getLastThreeMonths()}
      />

      {selectedCustomer && (
        <TransactionDetails
          month={filterMonth}
          monthData={context.selectedMonthData}
          transactions={allCustomerTransactions}
          onClose={handleCloseTransactionDetails}
          isOpen={showTransactionDetails}
          selectedMonth={filterMonth}
          selectedYear={filterYear}
        />
      )}
    </>
  );
}

function App() {
  useEffect(() => {
    logger.info('Application started');
  }, []);

  return (
    <RewardsProvider>
      <AppContainer>
        <Header>
          <h1>💰 Rewards Points Calculator</h1>
          <p>Track your customer rewards points</p>
        </Header>

        <MainContainer>
          <ContentArea>
            <AppContent />
          </ContentArea>
        </MainContainer>

        <Footer>
          <p>&copy; 2025 Rewards Calculator. All rights reserved.</p>
        </Footer>
      </AppContainer>
    </RewardsProvider>
  );
}

export default App;