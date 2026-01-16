
// Main User object from /api/auth/profile
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string;
  lastLoginAt?: string | null;
  isActive: boolean;
}

// Summary for card lists from GET /api/cards
export interface CreditCardSummary {
  id: string;
  maskedNumber: string;
  cardholderName: string;
  brand: string;
  type: string;
  status: string;
  currentBalance: number;
  creditLimit: number;
  availableCredit: number;
  expirationDate: string;
  alias: string;
}

// Detail for a single card from GET /api/cards/{id} or POST/PUT responses
export interface CreditCardDetail extends CreditCardSummary {
  createdAt: string;
  updatedAt: string;
}

// Summary for recent transactions from BFF
export interface TransactionSummary {
  id: string;
  cardMaskedNumber: string;
  type: string;
  merchantName?: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
}

// For paginated responses from .NET API - this one is generic but the key 'items' is not always used.
export interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Specific paginated types
export interface PaginatedPayments {
  payments: Payment[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Payment {
    id: string;
    reference: string;
    creditCardId: string;
    amount: number;
    currency: string;
    merchantName: string;
    merchantCategory: string;
    description: string;
    status: string;
    failureReason?: string;
    authorizationCode?: string;
    createdAt: string;
    completedAt?: string;
}

export interface Transaction extends TransactionSummary {
    creditCardId: string;
    category: string;
    balanceBefore: number;
    balanceAfter: number;
    createdAt: string;
}

// BFF ViewModel for the main dashboard from /api/bff/dashboard
export interface DashboardViewModel {
  user: {
    id: string;
    fullName: string;
    email: string;
    lastLoginAt?: string | null;
  };
  cards: {
    totalCards: number;
    activeCards: number;
    totalCreditLimit: number;
    totalAvailableCredit: number;
    totalBalance: number;
    cards: CreditCardSummary[];
  };
  spending: {
    thisMonth: number;
    lastMonth: number;
    percentageChange: number;
  };
  recentTransactions: TransactionSummary[];
}

export interface KpiFinancial {
  totalCreditLimit: number;
  totalUsedCredit: number;
  totalAvailableCredit: number;
  creditUtilizationPercent: number;
  totalDebt: number;
}

export interface KpiCards {
  totalCards: number;
  activeCards: number;
  blockedCards: number;
  expiredCards: number;
  cardsByBrand: Record<string, number>;
  cardsByType: Record<string, number>;
}

export interface KpiTopMerchant {
  name: string;
  totalSpent: number;
  transactionCount: number;
}

export interface KpiTransactions {
  totalTransactionsThisMonth: number;
  totalPurchases: number;
  totalPayments: number;
  totalRefunds: number;
  averageTransactionAmount: number;
  largestTransaction: number;
  topMerchant: KpiTopMerchant;
}

export interface KpiTrends {
  spendingThisMonth: number;
  spendingLastMonth: number;
  spendingChangePercent: number;
  paymentsThisMonth: number;
  paymentsLastMonth: number;
  spendingTrend: string;
}

export interface KpiViewModel {
  financial: KpiFinancial;
  cards: KpiCards;
  transactions: KpiTransactions;
  trends: KpiTrends;
}
