import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { CATEGORY_CONFIG } from "@/utils/transactionUtils";
import {
  CategoryType,
  Transaction,
  TransactionType,
} from "@/types/transaction";
import { useTransactions } from "@/context/TransactionContext";

export default function AddTransaction() {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("food");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { addTransaction } = useTransactions();

  const handleSaveTransaction = async () => {
    try {
      // Validate input
      if (!amount || isNaN(parseFloat(amount))) {
        Alert.alert("Error", "Please enter a valid amount");
        return;
      }

      if (!title.trim()) {
        Alert.alert("Error", "Please enter a title");
        return;
      }

      setIsSubmitting(true);

      // Create transaction object
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        title: title.trim(),
        category: selectedCategory,
        type,
        date,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        note: note.trim() || undefined,
      };

      // Save transaction
      await addTransaction(newTransaction);

      // Navigate back to history page
      router.push("/history");
    } catch (error) {
      Alert.alert("Error", "Failed to save transaction. Please try again.");
      console.error("Error saving transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Transaction Type Selector */}
      <View style={styles.typeSelectorContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === "expense"
              ? styles.activeExpenseButton
              : styles.inactiveButton,
          ]}
          onPress={() => setType("expense")}
        >
          <MaterialIcons
            name="arrow-downward"
            size={20}
            color={type === "expense" ? "#fff" : "#000"}
          />
          <Text
            style={
              type === "expense"
                ? styles.activeButtonText
                : styles.inactiveButtonText
            }
          >
            Expense
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            type === "income"
              ? styles.activeIncomeButton
              : styles.inactiveButton,
          ]}
          onPress={() => setType("income")}
        >
          <MaterialIcons
            name="arrow-upward"
            size={20}
            color={type === "income" ? "#fff" : "#000"}
          />
          <Text
            style={
              type === "income"
                ? styles.activeButtonText
                : styles.inactiveButtonText
            }
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount Input */}
      <View style={styles.amountContainer}>
        <Text style={styles.dollarSign}>$</Text>
        <TextInput
          style={styles.amountInput}
          keyboardType="decimal-pad"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* Title Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Category Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {Object.entries(CATEGORY_CONFIG).map(([key, category]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryButton,
                selectedCategory === key ? styles.selectedCategoryButton : null,
              ]}
              onPress={() => setSelectedCategory(key as CategoryType)}
            >
              {key === "food" && (
                <Ionicons name="restaurant" size={24} color="#555" />
              )}
              {key === "transport" && (
                <FontAwesome5 name="car" size={20} color="#555" />
              )}
              {key === "bills" && (
                <MaterialIcons name="receipt" size={24} color="#555" />
              )}
              {key === "shopping" && (
                <MaterialCommunityIcons
                  name="shopping"
                  size={24}
                  color="#555"
                />
              )}
              {key === "entertainment" && (
                <MaterialIcons name="movie" size={24} color="#555" />
              )}
              {key === "health" && (
                <FontAwesome5 name="heartbeat" size={20} color="#555" />
              )}
              {key === "housing" && (
                <MaterialCommunityIcons name="home" size={24} color="#555" />
              )}
              {key === "other" && (
                <MaterialIcons name="more-horiz" size={24} color="#555" />
              )}
              <Text style={styles.categoryText}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Date Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date</Text>
        <View style={styles.dateInputContainer}>
          <TextInput
            style={styles.dateInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />
          <MaterialIcons name="calendar-today" size={24} color="#555" />
        </View>
      </View>

      {/* Note Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Note (Optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Add a note"
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveTransaction}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Transaction</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  typeSelectorContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeExpenseButton: {
    backgroundColor: "#EF4444",
  },
  activeIncomeButton: {
    backgroundColor: "#10B981",
  },
  inactiveButton: {
    backgroundColor: "#f0f0f0",
  },
  activeButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  inactiveButtonText: {
    color: "#000",
    marginLeft: 8,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 8,
  },
  dollarSign: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "bold",
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#555",
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  categoryButton: {
    width: "25%",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedCategoryButton: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#6366F1",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
