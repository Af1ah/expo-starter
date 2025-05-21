import { CategoryType, TransactionType } from "../types/transaction";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

interface CategoryConfig {
  label: string;
  icon: any; // Using any for simplicity, ideally would be more specific
  color: string;
}

// Map category types to their config
export const CATEGORY_CONFIG: Record<CategoryType, CategoryConfig> = {
  food: {
    label: "Food",
    icon: Ionicons.name === "Ionicons" ? "restaurant" : "restaurant",
    color: "#FF6B6B",
  },
  transport: {
    label: "Transport",
    icon: FontAwesome5.name === "FontAwesome5" ? "car" : "car",
    color: "#4ECDC4",
  },
  bills: {
    label: "Bills",
    icon: MaterialIcons.name === "MaterialIcons" ? "receipt" : "receipt",
    color: "#FFD166",
  },
  
  shopping: {
    label: "Shopping",
    icon:
      MaterialCommunityIcons.name === "MaterialCommunityIcons"
        ? "shopping"
        : "shopping",
    color: "#F06292",
  },
  entertainment: {
    label: "Entertainment",
    icon: MaterialIcons.name === "MaterialIcons" ? "movie" : "movie",
    color: "#A78BFA",
  },
  health: {
    label: "Health",
    icon: FontAwesome5.name === "FontAwesome5" ? "heartbeat" : "heartbeat",
    color: "#06D6A0",
  },
  housing: {
    label: "Housing",
    icon:
      MaterialCommunityIcons.name === "MaterialCommunityIcons"
        ? "home"
        : "home",
    color: "#118AB2",
  },
 
  other: {
    label: "Other",
    icon: MaterialIcons.name === "MaterialIcons" ? "more-horiz" : "more-horiz",
    color: "#B5B5B5",
  },
};

// Transaction type configs
export const TRANSACTION_TYPE_CONFIG: Record<
  TransactionType,
  { color: string }
> = {
  income: {
    color: "#10B981",
  },
  expense: {
    color: "#EF4444",
  },
};

export const formatCurrency = (
  amount: number,
  type?: TransactionType,
): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  if (type === "expense") {
    return `-${formatter.format(Math.abs(amount))}`;
  } else if (type === "income") {
    return `+${formatter.format(Math.abs(amount))}`;
  }

  return formatter.format(amount);
};

export const getIconForCategory = (category: CategoryType) => {
  const config = CATEGORY_CONFIG[category];
  return config.icon;
};

export const getColorForCategory = (category: CategoryType) => {
  return CATEGORY_CONFIG[category].color;
};

export const getColorForTransactionType = (type: TransactionType) => {
  return TRANSACTION_TYPE_CONFIG[type].color;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const formatTime = (timeString: string): string => {
  // Assuming timeString is in format "HH:MM"
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};
