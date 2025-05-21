import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "../types/transaction";

const TRANSACTIONS_STORAGE_KEY = "@budgetapp_transactions";

export const saveTransaction = async (
  transaction: Transaction,
): Promise<void> => {
  try {
    // Get existing transactions
    const existingTransactionsJSON = await AsyncStorage.getItem(
      TRANSACTIONS_STORAGE_KEY,
    );
    let transactions: Transaction[] = [];

    if (existingTransactionsJSON) {
      transactions = JSON.parse(existingTransactionsJSON);
    }

    // Add new transaction
    transactions.push(transaction);

    // Save updated transactions
    await AsyncStorage.setItem(
      TRANSACTIONS_STORAGE_KEY,
      JSON.stringify(transactions),
    );
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw new Error("Failed to save transaction");
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactionsJSON = await AsyncStorage.getItem(
      TRANSACTIONS_STORAGE_KEY,
    );
    if (transactionsJSON) {
      return JSON.parse(transactionsJSON);
    }
    return [];
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw new Error("Failed to retrieve transactions");
  }
};

export const clearAllTransactions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing transactions:", error);
    throw new Error("Failed to clear transactions");
  }
};
