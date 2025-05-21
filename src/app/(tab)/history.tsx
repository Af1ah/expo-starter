import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTransactions } from "@/context/TransactionContext";
import { TransactionFilter, Transaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils/transactionUtils";

export default function HistoryScreen() {
  const { transactions, isLoading, error } = useTransactions();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  // Define filters
  const filters: TransactionFilter[] = [
    { id: "all", label: "All" },
    { id: "income", label: "Income", type: "income" },
    { id: "expense", label: "Expense", type: "expense" },
    { id: "food", label: "Food", category: "food" },
    { id: "transport", label: "Transport", category: "transport" },
    { id: "shopping", label: "Shopping", category: "shopping" },
  ];

  // Apply filters when activeFilter or transactions change
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredTransactions(transactions);
    } else {
      const filter = filters.find((f) => f.id === activeFilter);
      if (filter) {
        setFilteredTransactions(
          transactions.filter((transaction) => {
            if (filter.type) return transaction.type === filter.type;
            if (filter.category)
              return transaction.category === filter.category;
            return true;
          }),
        );
      }
    }
  }, [activeFilter, transactions]);

  // Group transactions by date
  const groupTransactionsByDate = () => {
    const groupedData: { [key: string]: Transaction[] } = {};

    filteredTransactions.forEach((transaction) => {
      let dateKey = transaction.date;

      const today = new Date().toISOString().split("T")[0];
      if (dateKey === today) {
        dateKey = "Today";
      } else {
        // Format date as "Month Day, Year"
        const date = new Date(dateKey);
        dateKey = `${date.toLocaleString("default", { month: "long" })} ${date.getDate()}, ${date.getFullYear()}`;
      }

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = [];
      }

      groupedData[dateKey].push(transaction);
    });

    // Convert to array for FlatList
    return Object.entries(groupedData).map(([date, transactions]) => ({
      date,
      transactions,
    }));
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    // Choose icon based on category
    let icon;
    switch (item.category) {
      case "food":
        icon = <Ionicons name="restaurant" size={20} color="#fff" />;
        break;
      case "transport":
        icon = <FontAwesome5 name="car" size={18} color="#fff" />;
        break;
      case "bills":
        icon = <MaterialIcons name="receipt" size={20} color="#fff" />;
        break;
      case "shopping":
        icon = (
          <MaterialCommunityIcons name="shopping" size={20} color="#fff" />
        );
        break;
      case "income":
        icon = <MaterialIcons name="account-balance" size={20} color="#fff" />;
        break;
      default:
        icon = <MaterialIcons name="category" size={20} color="#fff" />;
    }

    // Background color based on category
    const bgColors: { [key: string]: string } = {
      food: "#FF6B6B",
      transport: "#4ECDC4",
      bills: "#FFD166",
      shopping: "#F06292",
      entertainment: "#A78BFA",
      health: "#06D6A0",
      housing: "#118AB2",
      other: "#B5B5B5",
      income: "#10B981",
    };

    const bgColor =
      item.type === "income" ? "#10B981" : bgColors[item.category] || "#6C757D";
    const amountColor = item.type === "income" ? "#10B981" : "#EF4444";

    return (
      <TouchableOpacity style={styles.transactionItem}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          {icon}
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={[styles.amountText, { color: amountColor }]}>
            {formatCurrency(item.amount, item.type)}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDateSection = ({
    item,
  }: {
    item: { date: string; transactions: Transaction[] };
  }) => (
    <View style={styles.dateSection}>
      <Text style={styles.dateSectionTitle}>{item.date}</Text>
      {item.transactions.map((transaction) => (
        <View key={transaction.id}>
          {renderTransactionItem({ item: transaction })}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === item.id ? styles.activeFilterButton : null,
              ]}
              onPress={() => setActiveFilter(item.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item.id ? styles.activeFilterText : null,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Transactions List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="receipt-long" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No transactions found</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/addtransaction")}
          >
            <Text style={styles.addButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={groupTransactionsByDate()}
          renderItem={renderDateSection}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/addtransaction")}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchButton: {
    padding: 4,
  },
  filtersContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 100,
    backgroundColor: "#f0f0f0",
  },
  activeFilterButton: {
    backgroundColor: "#6366F1",
  },
  filterText: {
    color: "#555",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#6366F1",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginVertical: 16,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#6366F1",
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#666",
  },
  transactionItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  transactionCategory: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
  },
  timeText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
