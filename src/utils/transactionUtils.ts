import type { Transaction } from '../services/transactionService';

// Transform transaction data for PointsDisplay component
export interface PointsTransaction {
  id: string;
  taskTitle: string;
  points: number;
  date: Date;
  groupName: string;
}

export function transformTransactionForDisplay(transaction: Transaction): PointsTransaction {
  return {
    id: transaction.id,
    taskTitle: transaction.taskTitle,
    points: transaction.points,
    date: transaction.timestamp,
    groupName: transaction.groupName,
  };
}

export function transformTransactionsForDisplay(transactions: Transaction[]): PointsTransaction[] {
  return transactions.map(transformTransactionForDisplay);
}