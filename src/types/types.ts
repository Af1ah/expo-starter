export interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  limit: number;
  color: string;
  icon: string;
}

export interface BudgetMetrics {
  totalBudget: number;
  totalSpent: number;
  budgetRemaining: number;
  percentageUsed: number;
  daysRemaining: number;
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Utility functions for budget-related formatting and calculations
export const getProgressBarColor = (percentUsed: number): string => {
  if (percentUsed > 100) return "bg-red-500";
  if (percentUsed > 80) return "bg-amber-500";
  return "bg-emerald-500";
};

// Category icon background color utility
export const getCategoryBgColor = (categoryName: string): string => {
  switch (categoryName) {
    case "Food": return "bg-indigo-500";
    case "Transport": return "bg-amber-500";
    case "Bills": return "bg-emerald-500";
    case "Shopping": return "bg-pink-500";
    case "Entertainment": return "bg-purple-500";
    case "Housing": return "bg-blue-500";
    case "Health": return "bg-rose-500";
    case "Other": return "bg-gray-500";
    default: return "bg-red-500";
  }
};