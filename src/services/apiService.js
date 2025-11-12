import { calculateTotalRewards } from '../utils/rewardsCalculator';
import logger from '../logger';
import { API_DELAY } from '../utils/constants';

function simulateDelay(ms = API_DELAY) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchCustomers() {
  try {
    logger.info('API Service: Fetching customers...');
    await simulateDelay();

    const response = await fetch('/data/transactions.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.customers || !Array.isArray(data.customers)) {
      throw new Error('Invalid customers data format');
    }

    if (!data.transactions || !Array.isArray(data.transactions)) {
      throw new Error('Invalid transactions data format');
    }

    logger.info('Raw data loaded', {
      customerCount: data.customers.length,
      transactionCount: data.transactions.length
    });

    const customersWithPoints = data.customers.map(customer => {
      try {
        const customerTransactions = data.transactions.filter(
          t => t.customerId === customer.id
        );

        logger.debug('Processing customer', {
          customerId: customer.id,
          customerName: customer.name,
          transactionCount: customerTransactions.length,
          transactions: customerTransactions.map(t => ({ id: t.id, amount: t.amount }))
        });

        const totalPoints = calculateTotalRewards(customerTransactions);

        logger.info('Customer total points calculated', {
          customerId: customer.id,
          customerName: customer.name,
          totalPoints,
          transactionCount: customerTransactions.length
        });

        return {
          ...customer,
          totalPoints,
          transactionCount: customerTransactions.length
        };
      } catch (error) {
        logger.error('Error calculating points for customer', {
          customerId: customer.id,
          error: error.message
        });

        return {
          ...customer,
          totalPoints: 0,
          transactionCount: 0
        };
      }
    });

    logger.info('API Service: Customers fetched successfully', {
      count: customersWithPoints.length,
      totalPointsSum: customersWithPoints.reduce((sum, c) => sum + c.totalPoints, 0)
    });

    return customersWithPoints;
  } catch (error) {
    logger.error('API Service: Error fetching customers', {
      error: error.message
    });
    throw new Error('Failed to fetch customers: ' + error.message);
  }
}

export async function fetchTransactions(customerId) {
  try {
    logger.info('API: Fetching transactions', { customerId });

    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    await simulateDelay();

    const response = await fetch('/data/transactions.json');
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const data = await response.json();
    
    const transactions = data.transactions.filter(
      (t) => t.customerId === customerId
    );

    logger.info('API: Transactions fetched successfully', {
      customerId,
      count: transactions.length,
    });

    return transactions;
  } catch (error) {
    logger.error('API: Error fetching transactions', {
      customerId,
      error: error.message,
    });
    throw error;
  }
}

export async function fetchCustomerById(customerId) {
  try {
    logger.info('API: Fetching customer details', { customerId });

    const customers = await fetchCustomers();
    const customer = customers.find((c) => c.id === customerId);

    if (!customer) {
      throw new Error(`Customer ${customerId} not found`);
    }

    logger.info('API: Customer details fetched', { customerId, customer });
    return customer;
  } catch (error) {
    logger.error('API: Error fetching customer details', {
      customerId,
      error: error.message,
    });
    throw error;
  }
}

export async function fetchAllData() {
  try {
    logger.info('API: Fetching all data...');

    await simulateDelay();

    const response = await fetch('/data/transactions.json');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    logger.info('API: All data fetched successfully', {
      customers: data.customers.length,
      transactions: data.transactions.length,
    });

    return data;
  } catch (error) {
    logger.error('API: Error fetching all data', {
      error: error.message,
    });
    throw error;
  }
}

export async function searchTransactions(customerId, startDate, endDate) {
  try {
    logger.info('API: Searching transactions', {
      customerId,
      startDate,
      endDate,
    });

    const transactions = await fetchTransactions(customerId);

    const filtered = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });

    logger.info('API: Transactions search completed', {
      total: transactions.length,
      filtered: filtered.length,
    });

    return filtered;
  } catch (error) {
    logger.error('API: Error searching transactions', {
      customerId,
      error: error.message,
    });
    throw error;
  }
}

export async function getCustomerStatistics(customerId) {
  try {
    logger.info('API: Getting customer statistics', { customerId });

    const transactions = await fetchTransactions(customerId);

    const stats = {
      customerId,
      totalTransactions: transactions.length,
      minTransaction: transactions.length > 0
        ? Math.min(...transactions.map((t) => t.amount))
        : 0,
      maxTransaction: transactions.length > 0
        ? Math.max(...transactions.map((t) => t.amount))
        : 0,
      averageTransaction: transactions.length > 0
        ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
        : 0,
    };

    logger.info('API: Customer statistics retrieved', stats);
    return stats;
  } catch (error) {
    logger.error('API: Error getting customer statistics', {
      customerId,
      error: error.message,
    });
    throw error;
  }
}