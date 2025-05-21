import "react-native-url-polyfill/auto";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "@/types/transaction";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
export const saveTransactionToSupabase = async (
  transaction: Transaction,
): Promise<void> => {
  try {
    const { error } = await supabase.from("transactions").insert([transaction]);

    if (error) throw error;
  } catch (error) {
    console.error("Error saving transaction to Supabase:", error);
    throw new Error("Failed to save transaction to Supabase");
  }
};

// Function to fetch transactions from Supabase
export const getTransactionsFromSupabase = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    return data as Transaction[];
  } catch (error) {
    console.error("Error fetching transactions from Supabase:", error);
    throw new Error("Failed to fetch transactions from Supabase");
  }
};

// Function to update transaction in Supabase
export const updateTransactionInSupabase = async (
  transaction: Transaction,
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("transactions")
      .update(transaction)
      .eq("id", transaction.id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating transaction in Supabase:", error);
    throw new Error("Failed to update transaction in Supabase");
  }
};

// Function to delete transaction from Supabase
export const deleteTransactionFromSupabase = async (
  transactionId: string,
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting transaction from Supabase:", error);
    throw new Error("Failed to delete transaction from Supabase");
  }
};
