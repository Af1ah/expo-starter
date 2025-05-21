import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface BalanceCardProps {
  balance?: string;
  income?: string;
  expense?: string;
}

export default function BalanceCard({
  balance = "₹0",
  income = "₹0",
  expense = "₹0",
}: BalanceCardProps) {
  return (
    <LinearGradient
      colors={["#4c66ef", "#3b4fd3", "#2c3dcb"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-3xl shadow-lg m-4 overflow-hidden mb-6"
    >
      <View className="p-6">
        {/* Top section with balance info */}
        <View className="border-b border-white/10 pb-4">
          <Text className="text-sm font-medium text-white/80">
            Total Balance
          </Text>
          <Text className="text-4xl font-bold text-white my-2">{balance}</Text>

          <View className="flex-row items-center mt-1 bg-white/10 self-start px-2 py-1 rounded-full">
            <MaterialIcons name="trending-up" size={14} color="#4ADE80" />
            <Text className="text-sm text-white ml-1 font-medium">
              +12% from last month
            </Text>
          </View>
        </View>

        {/* Bottom section with actions */}
        <View className="flex-row space-x-3 mt-4">
          <ActionButton icon="south-west" label="Income" sublabel={income} />
          <ActionButton icon="north-east" label="Expense" sublabel={expense} />
        </View>
      </View>
    </LinearGradient>
  );
}

interface ActionButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  sublabel: string;
}

function ActionButton({ icon, label, sublabel }: ActionButtonProps) {
  return (
    <Pressable className="bg-white/10 rounded-2xl p-4 flex-1 flex-row items-center m-1 justify-between">
      <View>
        <Text className="text-white font-medium">{label}</Text>
        <Text className="text-white/80 text-xs mt-1">{sublabel}</Text>
      </View>
      <View className="bg-white/20 rounded-full p-2">
        <MaterialIcons name={icon} size={20} color="white" />
      </View>
    </Pressable>
  );
}
