// BudgetScreen.tsx - Main budget screen component

import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTransactionTotals } from "@/hooks/useTransactionTotals";
import { formatCurrency } from "@/utils/transactionUtils";
import { BudgetCategory, MONTHS } from "@/types/types";
import { CategoryItem, MonthlyBudgetOverview } from "@/components/BudgetComponents";

export default function BudgetScreen(): React.JSX.Element {
  const {
    food,
    shopping,
    transport,
    housing,
    health,
    other,
    bills,
    entertainment,
  } = useTransactionTotals();
  
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [newLimit, setNewLimit] = useState<string>("");

  // Initial budget categories derived from transaction data
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
    {
      id: "1",
      name: "Food",
      spent: food,
      limit: 800,
      color: "#4F46E5", // Indigo
      icon: "nutrition-outline",
    },
    {
      id: "2",
      name: "Transport",
      spent: transport,
      limit: 500,
      color: "#F59E0B", // Amber
      icon: "car-outline",
    },
    {
      id: "3",
      name: "Bills",
      spent: bills,
      limit: 400,
      color: "#10B981", // Emerald
      icon: "document-text-outline",
    },
    {
      id: "4",
      name: "Shopping",
      spent: shopping,
      limit: 300,
      color: "#EC4899", // Pink
      icon: "cart-outline",
    },
    {
      id: "5",
      name: "Entertainment",
      spent: entertainment,
      limit: 300,
      color: "#8B5CF6", // Purple
      icon: "film-outline",
    },
    {
      id: "6",
      name: "Housing",
      spent: housing,
      limit: 300,
      color: "#3B82F6", // Blue
      icon: "home-outline",
    },
    {
      id: "7",
      name: "Health",
      spent: health,
      limit: 300,
      color: "#F43F5E", // Rose
      icon: "medkit-outline",
    },
    {
      id: "8",
      name: "Other",
      spent: other,
      limit: 300,
      color: "#6B7280", // Gray
      icon: "ellipsis-horizontal-outline",
    },
  ]);

  // Calculate total budget metrics
  const budgetMetrics = useMemo(() => {
    const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.limit, 0);
    const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
    const budgetRemaining = totalBudget - totalSpent;
    const percentageUsed = Math.round((totalSpent / totalBudget) * 100);

    // Calculate days remaining in the month
    const today = new Date();
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const daysRemaining = lastDayOfMonth - today.getDate();

    return {
      totalBudget,
      totalSpent,
      budgetRemaining,
      percentageUsed,
      daysRemaining,
    };
  }, [budgetCategories]);

  // Get current month and year
  const currentMonth = useMemo(() => {
    const currentDate = new Date();
    return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }, []);

  // Memoized handlers
  const openEditModal = useCallback((category: BudgetCategory) => {
    setSelectedCategory(category);
    setNewLimit(category.limit.toString());
    setModalVisible(true);
  }, []);

  const saveBudgetLimit = useCallback(() => {
    if (selectedCategory && newLimit) {
      setBudgetCategories(prev => 
        prev.map(cat =>
          cat.id === selectedCategory.id
            ? { ...cat, limit: parseFloat(newLimit) }
            : cat
        )
      );
      setModalVisible(false);
    }
  }, [selectedCategory, newLimit]);

  const closeModal = useCallback(() => setModalVisible(false), []);
  const navigateToAddTransaction = useCallback(() => router.push("/addtransaction"), [router]);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-12 pb-4 bg-white">
        <Text className="text-2xl font-bold text-gray-800">Budget</Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center"
          onPress={navigateToAddTransaction}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Monthly Budget Overview */}
        <MonthlyBudgetOverview 
          budgetMetrics={budgetMetrics} 
          currentMonth={currentMonth} 
        />

        {/* Category Breakdown */}
        <Text className="mx-4 mt-6 mb-2 text-lg font-semibold text-gray-800">
          Budget by Category
        </Text>

        {budgetCategories.map((category) => (
          <CategoryItem 
            key={category.id} 
            category={category} 
            onPress={openEditModal} 
          />
        ))}
      </ScrollView>

      {/* Edit Budget Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-center text-gray-800 mb-6">
              Edit {selectedCategory?.name} Budget
            </Text>

            <View className="bg-gray-100 rounded-xl p-4 mb-6">
              <Text className="text-sm text-gray-500 mb-1">Current Budget</Text>
              <Text className="text-lg font-semibold text-gray-800">
                {selectedCategory ? formatCurrency(selectedCategory.limit) : "$0"}
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-sm text-gray-500 mb-2">New Budget Limit</Text>
              <TextInput
                className="border border-gray-300 rounded-xl p-4 text-lg"
                keyboardType="numeric"
                value={newLimit}
                onChangeText={setNewLimit}
                placeholder="Enter new budget limit"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="flex-row gap-4">
              <TouchableOpacity
                className="flex-1 p-4 rounded-xl border border-gray-300"
                onPress={closeModal}
              >
                <Text className="text-center font-medium text-gray-800">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 p-4 rounded-xl bg-indigo-500"
                onPress={saveBudgetLimit}
              >
                <Text className="text-center font-medium text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}