import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { PieChart, LineChart, BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import {
  ArrowUpRight,
  Wallet,
  Calendar,
  TrendingUp,
} from "lucide-react-native";
import { useReceiptStore } from "../../store/receiptStore";
import { useRouter } from "expo-router";
import { Receipt } from "lucide-react-native";
import { MotiView } from "moti";

const screenWidth = Dimensions.get("window").width;
let pieAmount = [];
// Mock data for the charts
const pieChartData = [
  { name: "Dining Out", amount: 0, color: "#FF6384" },
  { name: "Groceries", amount: 0, color: "#36A2EB" },
  { name: "Transportation", amount: 0, color: "#FFCE56" },
  { name: "Entertainment", amount: 0, color: "#4BC0C0" },
  { name: "Rent/Mortgage", amount: 0, color: "#4BC0C0" },
  { name: "Utilities", amount: 0, color: "#4BC0C0" },
  { name: "Transportation", amount: 0, color: "#4BC0C0" },
  { name: "Health & Fitness", amount: 0, color: "#4BC0C0" },
  { name: "Insurance", amount: 0, color: "#4BC0C0" },
  { name: "Shopping", amount: 0, color: "#4BC0C0" },
  { name: "Travel", amount: 0, color: "#4BC0C0" },
  { name: "Education", amount: 0, color: "#4BC0C0" },
  { name: "Personal Care", amount: 0, color: "#4BC0C0" },
  { name: "Savings/Investments", amount: 0, color: "#4BC0C0" },
  { name: "Debt Payments", amount: 0, color: "#4BC0C0" },
  { name: "Childcare", amount: 0, color: "#4BC0C0" },
  { name: "Gifts & Donations", amount: 0, color: "#4BC0C0" },
  { name: "Home Maintenance", amount: 0, color: "#4BC0C0" },
  { name: "Pet Care", amount: 0, color: "#4BC0C0" },
  { name: "Miscellaneous", amount: 0, color: "#4BC0C0" },
];

const lineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [200, 450, 280, 800, 990, 1500],
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

export default function ExpenseDashboard() {
  const { receiptsStore } = useReceiptStore();
  const [total, setTotal] = useState("");
  const [transactions, setTransactions] = useState("");
  const [tax, setTax] = useState();
  const [newPieData, setNewPieData] = useState([]);
  const [mapStore, setMapStore] = useState("");
  const router = useRouter();
  function addTotal() {
    const sumOfTotal = receiptsStore?.reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue.total);
    }, 0);
    setTotal(sumOfTotal);
  }

  function addTax() {
    const sumOfTotal = receiptsStore?.reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue.tax);
    }, 0);
    setTax(sumOfTotal.toFixed(2));
  }
  function numberOfTransactions() {
    let allTransaction = receiptsStore?.map((item) => item.store_name);
    setTransactions(allTransaction.length);
  }

  function findOutPercent(argCategorie) {
    const categoriesTotal = receiptsStore
      ?.filter((item) => item.category == argCategorie)
      .reduce((accumulator, currentValue, index) => {
        return accumulator + parseFloat(currentValue.total);
      }, 0);

    pieAmount.push(categoriesTotal);
    console.log(pieAmount);
  }
  useEffect(() => {
    addTotal();
    numberOfTransactions();
    addTax();

    for (let b of pieChartData) {
      findOutPercent(b.name);
    }

    for (let x in pieChartData) {
      if (pieAmount[x] != 0) {
        pieChartData[x].amount = pieAmount[x];
      }
    }

    let newData = pieChartData?.filter((obj) => obj.amount !== 0);
    console.log(newData, "newData");

    setNewPieData(newData);

    setMapStore(receiptsStore.reverse());
  }, [receiptsStore]);

  if (receiptsStore?.length < 2) {
    return (
      <View className='bg-zinc-900 h-full w-full flex justify-center items-center px-6'>
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 500 }}
          className='flex items-center'
        >
          <View className='bg-zinc-800 rounded-full p-6 mb-8'>
            <Receipt size={64} color='#ffffff' />
          </View>
          <Text className='text-white text-2xl font-bold text-center mb-4'>
            Start Tracking Your Expenses
          </Text>
          <Text className='text-zinc-400 text-lg text-center mb-8'>
            Log at least 2 receipts to begin analyzing your spending habits
          </Text>
          <TouchableOpacity
            className='bg-sky-500 py-3 px-6 rounded-full'
            activeOpacity={0.8}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text className='text-white font-semibold text-lg'>
              Add Your First Receipt
            </Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-zinc-900'>
      <ScrollView className='flex-1 px-4 py-6'>
        <View className='flex-row justify-between items-center mb-8'>
          <Text className='text-white text-2xl font-bold'>
            Expense Dashboard
          </Text>
        </View>

        {/* Total Expenses Card */}
        <View className='bg-zinc-800 rounded-xl p-4 mb-6'>
          <Text className='text-zinc-400 text-lg mb-2'>Total Expenses</Text>
          <Text className='text-white text-4xl font-bold'>${total}</Text>
          {/* <Text className='text-green-500 text-sm mt-2'>
            +15% from last month
          </Text> */}
        </View>

        {/* Quick Stats */}
        <View className='flex-row justify-between mb-6'>
          <View className='bg-zinc-800 rounded-xl p-4 flex-1 mr-2'>
            <Wallet size={24} color='#fff' />
            <Text className='text-white text-lg font-semibold mt-2'>
              {transactions}
            </Text>
            <Text className='text-zinc-400'>Transactions</Text>
          </View>
          <View className='bg-zinc-800 rounded-xl p-4 flex-1 ml-2'>
            <Calendar size={24} color='#fff' />
            <Text className='text-white text-lg font-semibold mt-2'>{tax}</Text>
            <Text className='text-zinc-400'>Total Sales Tax</Text>
          </View>
        </View>

        {/* Expense Categories */}
        <Text className='text-white text-xl font-bold mb-4'>
          Expense Categories
        </Text>
        <View className='w-fit h-fit bg-white rounded-3xl '>
          <PieChart
            data={newPieData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              legendFontColor: "white",
              style: {
                borderRadius: 16,
              },
            }}
            backgroundColor='transparent'
            accessor='amount'
            paddingLeft='15'
          />
        </View>
        {/* Monthly Trend
        <Text className='text-white text-xl font-bold mt-6 mb-4'>
          Monthly Trend
        </Text>
        <BarChart
          data={lineChartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: "#1e1e1e",
            backgroundGradientFrom: "#1e1e1e",
            backgroundGradientTo: "#1e1e1e",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        /> */}

        {/* Recent Transactions */}
        <Text className='text-white text-xl font-bold mt-6 mb-4'>
          Recent Transactions
        </Text>
        <View className='bg-zinc-800 rounded-xl p-4 mb-4'>
          <View className='flex-row justify-between items-center'>
            <View>
              <Text className='text-white text-lg font-semibold'>
                {mapStore[0]?.store_name}
              </Text>
              <Text className='text-zinc-400'>
                {receiptsStore[0]?.category} •{receiptsStore[0]?.date}
              </Text>
            </View>
            <Text className='text-white text-lg font-bold'>
              ${receiptsStore[0]?.total}
            </Text>
          </View>
        </View>
        <View className='bg-zinc-800 rounded-xl p-4 mb-4'>
          <View className='flex-row justify-between items-center'>
            <View>
              <Text className='text-white text-lg font-semibold'>
                {receiptsStore[1]?.store_name}
              </Text>
              <Text className='text-zinc-400'>
                {receiptsStore[1]?.category} •{receiptsStore[1]?.date}
              </Text>
            </View>
            <Text className='text-white text-lg font-bold'>
              ${receiptsStore[1]?.total}
            </Text>
          </View>
        </View>

        {/* View All Transactions Button */}
        <Pressable
          onPress={() => router.replace("/(home)/Home")}
          className='bg-white px-6 py-4 rounded-xl flex-row items-center justify-center mt-4'
        >
          <Text className='text-black text-lg font-semibold mr-2'>
            View All Transactions
          </Text>
          <ArrowUpRight size={24} color='#000' />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
