import { MONTHS } from './constants';
import logger from '../logger';

export function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    logger.error('Error formatting date', { dateString, error: error.message });
    return dateString;
  }
}

export function getMonthName(monthNumber) {
  if (monthNumber < 1 || monthNumber > 12) {
    logger.warn('Invalid month number', { monthNumber });
    return '';
  }
  return MONTHS[monthNumber - 1];
}

export function getMonthNumber(monthName) {
  const index = MONTHS.indexOf(monthName);
  return index === -1 ? 0 : index + 1;
}

export function getLastNMonths(months = 3) {
  logger.debug('Getting last N months', { months });
  const result = [];
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    result.push({
      month: getMonthName(date.getMonth() + 1),
      year: date.getFullYear(),
      monthNumber: date.getMonth() + 1,
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
    });
  }

  logger.debug('Last N months retrieved', { count: result.length });
  return result;
}

export function getMonthKeyFromDate(dateString) {
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  } catch (error) {
    logger.error('Error getting month key from date', { dateString, error: error.message });
    return '';
  }
}

export function isCurrentMonth(dateString) {
  try {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    logger.error('Error checking current month', { dateString, error: error.message });
    return false;
  }
}

export function formatDateRange(startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  } catch (error) {
    logger.error('Error formatting date range', { startDate, endDate, error: error.message });
    return `${startDate} - ${endDate}`;
  }
}

export function getDayOfWeek(dateString) {
  try {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  } catch (error) {
    logger.error('Error getting day of week', { dateString, error: error.message });
    return '';
  }
}