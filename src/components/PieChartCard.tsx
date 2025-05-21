import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

// Pie chart item type
type PieDataItem = {
  value: number;
  color: string;
  gradientCenterColor: string;
  focused?: boolean;
  label?: string;
};

// Component props
interface PerformanceChartProps {
  title?: string;
  data?: PieDataItem[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title = "Spending",
  data = defaultPieData,
}) => {
  const chartData = data.length > 0 ? data : defaultPieData;

  // Focused item for the center label
  const focusedItem =
    chartData.find((item) => item.focused) || chartData[0] || {
      value: 0,
      label: "N/A",
    };

  // Render dot + label for legend
  const renderLegendItem = (item: PieDataItem, index: number) => (
    <View key={index} className="flex-row items-center m-1">
      <View
        className="h-3 w-3 rounded-full mr-2"
        style={{ backgroundColor: item.color }}
      />
      <Text className="text-gray-700 text-sm">
        {item.label || "Unnamed"}: {item.value}%
      </Text>
    </View>
  );

  return (
    <View className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm mx-6 my-4 p-4">
      <Text className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        {title}
      </Text>

      <View className="items-center justify-center py-2">
        <PieChart
          data={chartData}
          donut
          showGradient
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          innerCircleColor={"#FFFFFF"}
          centerLabelComponent={() => (
            <View className="justify-center items-center">
              <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                {focusedItem.value}%
              </Text>
              <Text className="text-base text-gray-500 dark:text-gray-400">
                {focusedItem.label}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Legend */}
      <View className="flex-row flex-wrap justify-around mt-4">
        {chartData.map(renderLegendItem)}
      </View>
    </View>
  );
};

// Fallback/default pie chart data
const defaultPieData: PieDataItem[] = [
  {
    value: 30,
    color: "#6366F1",
    gradientCenterColor: "#6366F1",
    focused: true,
    label: "Excellent",
  },
  {
    value: 40,
    color: "#93FCF8",
    gradientCenterColor: "#3BE9DE",
    label: "Good",
  },
  {
    value: 16,
    color: "#EF4444",
    gradientCenterColor: "#8F80F3",
    label: "Okay",
  },
  {
    value: 3,
    color: "#FFA5BA",
    gradientCenterColor: "#FF7F97",
    label: "Poor",
  },
];

export default PerformanceChart;
