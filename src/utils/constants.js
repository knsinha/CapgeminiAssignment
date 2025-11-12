export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Available years for filtering
export const YEARS = [2021, 2022, 2023, 2024, 2025];

// Reward calculation thresholds
export const REWARD_THRESHOLDS = {
  min: 50,           // Minimum transaction amount to earn points
  tier1End: 100,     // End of tier 1 ($50-$100)
  tier2Start: 100,   // Start of tier 2 ($100+)
};

// Points per dollar for each tier
export const REWARD_RATES = {
  tier1: 1,  // 1 point per dollar for $50-$100
  tier2: 2,  // 2 points per dollar for $100+
};

// Pagination configuration
export const ITEMS_PER_PAGE = {
  customers: 5,      // Number of customers per page
  transactions: 10,  // Number of transactions per page
};

// API delay simulation in milliseconds
export const API_DELAY = 800;

// Error messages
export const ERROR_MESSAGES = {
  LOAD_FAILED: 'Failed to load data. Please try again.',
  NO_TRANSACTIONS: 'No transactions found for the selected period.',
  INVALID_INPUT: 'Invalid input provided.',
  API_ERROR: 'An error occurred while fetching data.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOADED: 'Data loaded successfully.',
  CALCULATED: 'Rewards calculated successfully.',
};

// Application strings
export const APP_STRINGS = {
  APP_TITLE: 'Rewards Points Calculator',
  CUSTOMER_LIST_TITLE: 'Customer List',
  REWARDS_TITLE: 'Customer Rewards',
  TRANSACTIONS_TITLE: 'Transaction Details',
  NO_DATA: 'No transactions',
  LOADING: 'Loading...',
  BACK_BUTTON: 'Back to Customers',
  VIEW_DETAILS: 'View Details',
  MONTH_LABEL: 'Month',
  YEAR_LABEL: 'Year',
  TOTAL_POINTS: 'Total Points',
  POINTS_SUFFIX: ' points',
};

// Table column headers
export const TABLE_HEADERS = {
  CUSTOMER_ID: 'Customer ID',
  CUSTOMER_NAME: 'Customer Name',
  TOTAL_POINTS: 'Total Points',
  ACTIONS: 'Actions',
  TRANSACTION_ID: 'Transaction ID',
  AMOUNT: 'Amount',
  DATE: 'Date',
  POINTS_EARNED: 'Points Earned',
};

// Default filter values
export const DEFAULT_FILTERS = {
  months: 3,  // Show last 3 months by default
  startMonth: 'October',
  startYear: 2024,
};

// Currency symbol
export const CURRENCY_SYMBOL = '$';

// Date format
export const DATE_FORMAT = {
  display: 'MMM DD, YYYY',
  storage: 'YYYY-MM-DD',
};