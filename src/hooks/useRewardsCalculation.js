import { useMemo } from 'react';
import {
  calculateRewards,
  calculateRewardsByMonth,
  filterTransactionsByMonthYear,
  getRewardsStatistics,
} from '../utils/rewardsCalculator';
import logger from '../logger';

export function useRewardsCalculation(
  transactions = [],
  filterMonth = null,
  filterYear = null
) {
  return useMemo(() => {
    logger.debug('useRewardsCalculation: Computing rewards', {
      transactionCount: transactions.length,
      filterMonth,
      filterYear,
    });

    if (!Array.isArray(transactions) || transactions.length === 0) {
      logger.warn('useRewardsCalculation: No transactions provided');
      return {
        totalRewards: 0,
        rewardsByMonth: [],
        rewardsByTransaction: [],
        filteredRewards: [],
        statistics: {
          min: 0,
          max: 0,
          average: 0,
          total: 0,
          count: 0,
        },
        filteredTransactionCount: 0,
      };
    }

    try {
      const rewardsByTransaction = transactions.map((transaction) => ({
        ...transaction,
        points: calculateRewards(transaction.amount),
      }));

      const rewardsByMonth = calculateRewardsByMonth(transactions);

      const totalRewards = rewardsByTransaction.reduce(
        (sum, t) => sum + t.points,
        0
      );

      const statistics = getRewardsStatistics(transactions);

      let filteredRewards = rewardsByTransaction;
      let filteredTransactionCount = rewardsByTransaction.length;

      if (filterMonth && filterYear) {
        filteredRewards = filterTransactionsByMonthYear(
          transactions,
          filterMonth,
          filterYear
        ).map((transaction) => ({
          ...transaction,
          points: calculateRewards(transaction.amount),
        }));
        filteredTransactionCount = filteredRewards.length;

        logger.debug('useRewardsCalculation: Filtered rewards calculated', {
          count: filteredTransactionCount,
        });
      }

      const result = {
        totalRewards,
        rewardsByMonth,
        rewardsByTransaction,
        filteredRewards,
        statistics,
        filteredTransactionCount,
      };

      logger.debug('useRewardsCalculation: Calculation complete', {
        totalRewards,
        monthsCount: rewardsByMonth.length,
      });

      return result;
    } catch (error) {
      logger.error('useRewardsCalculation: Error calculating rewards', {
        error: error.message,
      });
      return {
        totalRewards: 0,
        rewardsByMonth: [],
        rewardsByTransaction: [],
        filteredRewards: [],
        statistics: { min: 0, max: 0, average: 0, total: 0, count: 0 },
        filteredTransactionCount: 0,
      };
    }
  }, [transactions, filterMonth, filterYear]);
}