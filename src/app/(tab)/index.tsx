import React from "react";
import { View, ScrollView } from "react-native";
import BalanceCard from "@/components/BalenceCard";
import PerformanceChart from "@/components/PieChartCard";
import { formatCurrency } from "@/utils/transactionUtils";
import { useTransactionTotals } from "@/hooks/useTransactionTotals";

export default function HomeScreen() {
  const {
    incomeTotal,
    expenseTotal,
    food,
    shopping,
    transport,
    housing,
    health,
    other,
    bills,
    entertainment,
  } = useTransactionTotals();

  const balance = incomeTotal - expenseTotal;

  const spendingData = [
    {
      value: food,
      color: "#6366F1", // Indigo
      gradientCenterColor: "#6366F1",
      label: "Food",
    },
    {
      value: shopping,
      color: "#93FCF8", // Light teal
      gradientCenterColor: "#3BE9DE",
      label: "Shopping",
    },
    {
      value: transport,
      color: "#F59E0B", // Amber
      gradientCenterColor: "#FBBF24",
      label: "Transport",
    },
    {
      value: housing,
      color: "#60A5FA", // Blue
      gradientCenterColor: "#3B82F6",
      label: "Housing",
    },
    {
      value: health,
      color: "#10B981", // Emerald
      gradientCenterColor: "#34D399",
      label: "Health",
    },
    {
      value: entertainment,
      color: "#EC4899", // Pink
      gradientCenterColor: "#F472B6",
      label: "Entertainment",
    },
    {
      value: bills,
      color: "#A78BFA", // Violet
      gradientCenterColor: "#8B5CF6",
      label: "Bills",
    },
    {
      value: other,
      color: "#9CA3AF", // Gray
      gradientCenterColor: "#6B7280",
      label: "Other",
    },
  ].filter(item => item.value > 0); // ✅ optional: remove 0-value categories from chart

  return (
    <ScrollView className="flex-1 p-3 bg-white dark:bg-black">
      <BalanceCard
        balance={formatCurrency(balance)}
        income={formatCurrency(incomeTotal)}
        expense={formatCurrency(expenseTotal)}
      />
      <PerformanceChart title="Spending" data={spendingData} />
      <View className="h-24" /> {/* Bottom spacing */}
    </ScrollView>
  );
}
