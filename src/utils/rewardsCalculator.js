import { REWARD_THRESHOLDS, REWARD_RATES } from './constants';
import logger from '../logger';

export function calculateRewards(amount) {
  logger.debug('Calculating rewards for amount', { amount });

  if (typeof amount !== 'number' || amount < 0) {
    logger.warn('Invalid amount for rewards calculation', { amount });
    return 0;
  }

  if (amount < REWARD_THRESHOLDS.min) {
    logger.debug('Amount below minimum threshold', {
      amount,
      min: REWARD_THRESHOLDS.min,
    });
    return 0;
  }

  if (amount <= REWARD_THRESHOLDS.tier1End) {
    const tier1Amount = Math.floor(amount - REWARD_THRESHOLDS.min);
    const points = tier1Amount * REWARD_RATES.tier1;

    logger.debug('Tier 1 calculation', { amount, tier1Amount, points });
    return points;
  }

  const tier1Amount = REWARD_THRESHOLDS.tier1End - REWARD_THRESHOLDS.min;
  const tier1Points = tier1Amount * REWARD_RATES.tier1;

  const tier2Amount = amount - REWARD_THRESHOLDS.tier2Start;
  const tier2Points = tier2Amount * REWARD_RATES.tier2;

  const totalPoints = tier1Points + tier2Points;
  logger.debug('Tier 2 calculation', {
    amount,
    tier1Amount,
    tier1Points,
    tier2Amount,
    tier2Points,
    totalPoints,
  });

  return totalPoints;
}

export function calculateTotalRewards(transactions = []) {
  logger.debug('Calculating total rewards', { transactionCount: transactions.length });

  if (!Array.isArray(transactions) || transactions.length === 0) {
    logger.warn('Invalid or empty transactions array for total calculation');
    return 0;
  }

  const total = transactions.reduce((sum, transaction) => {
    const points = calculateRewards(transaction.amount);
    return sum + points;
  }, 0);

  logger.debug('Total rewards calculated', { total, transactionCount: transactions.length });
  return total;
}
export function calculateRewardsByMonth(transactions = []) {
  logger.debug('Calculating rewards by month', { transactionCount: transactions.length });

  if (!Array.isArray(transactions) || transactions.length === 0) {
    logger.warn('No transactions to group by month');
    return [];
  }

  const rewardsByMonth = {};

  transactions.forEach((transaction) => {
    try {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = getMonthYearString(date);

      if (!rewardsByMonth[monthKey]) {
        rewardsByMonth[monthKey] = {
          month: monthKey,
          monthName,
          points: 0,
          transactionCount: 0,
          transactions: [],
        };
      }

      const points = calculateRewards(transaction.amount);
      rewardsByMonth[monthKey].points += points;
      rewardsByMonth[monthKey].transactionCount += 1;
      rewardsByMonth[monthKey].transactions.push({
        ...transaction,
        points,
      });
    } catch (error) {
      logger.error('Error processing transaction for monthly calculation', {
        transaction,
        error: error.message,
      });
    }
  });

  const result = Object.values(rewardsByMonth);
  logger.debug('Monthly rewards calculated', { months: result.length, result });
  return result;
}

export function filterTransactionsByMonthYear(transactions = [], month, year) {
  logger.debug('Filtering transactions', { month, year, totalTransactions: transactions.length });

  if (!Array.isArray(transactions)) {
    logger.warn('Invalid transactions array for filtering');
    return [];
  }

  const filtered = transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    const transactionMonth = date.getMonth();
    const transactionYear = date.getFullYear();

    const monthNumber = new Date(`${month} 1`).getMonth();

    return transactionMonth === monthNumber && transactionYear === year;
  });

  logger.debug('Transactions filtered', { count: filtered.length });
  return filtered;
}

function getMonthYearString(date) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function getRewardsStatistics(transactions = []) {
  logger.debug('Calculating rewards statistics', { transactionCount: transactions.length });

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { min: 0, max: 0, average: 0, total: 0, count: 0 };
  }

  const points = transactions.map((t) => calculateRewards(t.amount));
  const total = points.reduce((sum, p) => sum + p, 0);
  const average = total / transactions.length;
  const min = Math.min(...points);
  const max = Math.max(...points);

  const stats = { min, max, average, total, count: transactions.length };
  logger.debug('Rewards statistics calculated', stats);
  return stats;
}

export default {
  calculateRewards,
  calculateTotalRewards
};