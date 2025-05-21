import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Transaction } from "@/types/transaction";
import { getTransactions, saveTransaction } from "@/utils/storage";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const storedTransactions = await getTransactions();
        setTransactions(storedTransactions);
      } catch (err) {
        setError("Failed to load transactions");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const addTransaction = async (transaction: Transaction): Promise<void> => {
    try {
      await saveTransaction(transaction);
      setTransactions((prev) => [...prev, transaction]);
    } catch (err) {
      setError("Failed to add transaction");
      console.error(err);
      throw err;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        isLoading,
        error,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider",
    );
  }
  return context;
};
