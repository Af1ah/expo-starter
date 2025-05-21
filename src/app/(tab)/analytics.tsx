import React from "react";
import { View, Button } from "react-native";
import { useTransactions } from "@/context/TransactionContext";

// Define the shape of a transaction if not already typed in context
interface Transaction {
  amount: number;
  type: "income" | "expense";
  // Add other fields if needed: title, date, etc.
}

export default function BalanceCard(): JSX.Element {
  const { transactions } = useTransactions();

  // Optional: assert transactions array type
  const typedTransactions: Transaction[] = transactions;

  let incomeTotal = 0;
  let expenseTotal = 0;

  typedTransactions.forEach((t) => {
    if (t.type === "income") {
      incomeTotal += t.amount;
    } else if (t.type === "expense") {
      expenseTotal += t.amount;
    }
  });

  return (
    <View className="p-4 space-y-4">
      <Button
        title="Show Total Income"
        onPress={() => console.log("Total Income: ₹", incomeTotal)}
      />
      <Button
        title="Show Transaction Types"
        onPress={() => console.log(typedTransactions.map((t) => t.type))}
      />
      <Button
        title="Show Total Expense"
        onPress={() => console.log("Total Expense: ₹", expenseTotal)}
      />
    </View>
  );
}
