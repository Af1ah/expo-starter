// BudgetComponents.tsx - Reusable components for the budget screen

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "@/utils/transactionUtils";
import { BudgetCategory, BudgetMetrics, getProgressBarColor, getCategoryBgColor } from "@/types/types";

interface CategoryItemProps {
  category: BudgetCategory;
  onPress: (category: BudgetCategory) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ category, onPress }) => {
  const percentUsed = Math.round((category.spent / category.limit) * 100);
  const remaining = category.limit - category.spent;
  const isOverBudget = category.spent > category.limit;

  return (
    <TouchableOpacity
      key={category.id}
      className="mx-4 mb-4 bg-white rounded-xl shadow-sm p-4"
      onPress={() => onPress(category)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full mr-2 items-center justify-center ${getCategoryBgColor(category.name)}`}
          >
            <Ionicons name={category.icon} size={16} color="white" />
          </View>
          <Text className="font-medium text-gray-800">{category.name}</Text>
        </View>
        <Text className="font-semibold text-gray-800">
          {formatCurrency(category.spent)} / {formatCurrency(category.limit)}
        </Text>
      </View>

      {/* Category Progress Bar */}
      <View className="h-2 bg-gray-200 rounded-full mb-2">
        <View
          className={`h-2 rounded-full ${getProgressBarColor(percentUsed)}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </View>

      <View className="flex-row justify-between">
        <Text className="text-sm text-gray-600">{percentUsed}% used</Text>
        <Text
          className={`text-sm ${isOverBudget ? "text-red-500" : "text-gray-600"}`}
        >
          {isOverBudget
            ? `${formatCurrency(Math.abs(remaining))} over budget`
            : `${formatCurrency(remaining)} left`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface MonthlyBudgetOverviewProps {
  budgetMetrics: BudgetMetrics;
  currentMonth: string;
}

export const MonthlyBudgetOverview: React.FC<MonthlyBudgetOverviewProps> = ({
  budgetMetrics,
  currentMonth,
}) => {
  return (
    <View className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-gray-800">Monthly Budget</Text>
        <Text className="text-indigo-500">{currentMonth}</Text>
      </View>

      <View className="mb-2">
        <Text className="text-2xl font-bold text-gray-800">
          {formatCurrency(budgetMetrics.totalSpent)} / 
          {formatCurrency(budgetMetrics.totalBudget)}
        </Text>
        <Text className="text-gray-500 text-sm">
          {budgetMetrics.percentageUsed}% of budget used
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="h-2 bg-gray-200 rounded-full mb-2">
        <View
          className={`h-2 rounded-full ${getProgressBarColor(budgetMetrics.percentageUsed)}`}
          style={{ width: `${Math.min(budgetMetrics.percentageUsed, 100)}%` }}
        />
      </View>

      <View className="flex-row justify-between">
        <Text className="text-sm text-gray-600">
          {formatCurrency(budgetMetrics.budgetRemaining)} left
        </Text>
        <Text className="text-sm text-gray-600">
          {budgetMetrics.daysRemaining} days remaining
        </Text>
      </View>
    </View>
  );
};