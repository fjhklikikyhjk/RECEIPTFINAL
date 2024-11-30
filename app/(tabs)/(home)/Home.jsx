import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { PlusCircle, ChevronRight, Search, Receipt } from "lucide-react-native";
import { Link } from "expo-router";
import { useReceiptStore } from "../../../store/receiptStore";
import { MotiView } from "moti";
import { useRouter } from "expo-router";

export default function ReceiptList() {
  const { receiptsStore } = useReceiptStore();
  const [filterStore, setFilterStore] = useState();
  const [search, setSearch] = useState("");
  const [todaysDate, setTodaysDate] = useState("");
  const router = useRouter();
  useEffect(() => {
    let today = new Date();
    let createdDay = today.toISOString().split("T")[0];
    setTodaysDate(createdDay);
  }, []);

  const renderReceiptItem = ({ item }) => (
    <TouchableOpacity
      className={`flex-row justify-between h-fit  items-center ${
        item.createdDay === todaysDate ? "bg-sky-500" : "bg-zinc-800"
      } mx-4 mb-2  rounded-lg shadow`}
    >
      <Link
        href={{
          pathname: "[id] ",
          params: { id: item.id },
        }}
        className=' w-screen z-50  h-full flex-row justify-end p-4  items-end gap-3'
      >
        <View className='flex-1 flex-row'>
          <Image
            source={{ uri: item?.uri }}
            className='w-14 mt-3 h-14 rounded-lg'
          />
          <View className='flex flex-col mt-2 ml-1'>
            <Text className='text-base font-bold text-white'>
              {item.store_name}
            </Text>
            <Text className='text-sm text-white mt-1'>{item.date}</Text>
            <Text className='bg-zinc-50 p-1 w-fit rounded-full mt-1 px-2'>
              {item.category}
            </Text>
          </View>
        </View>
      </Link>
      <View className='flex-row items-center absolute right-4'>
        <Text className='text-base font-bold text-white mr-2 '>
          ${item.total}
        </Text>
        <ChevronRight size={20} color='#4B5563' />
      </View>
    </TouchableOpacity>
  );

  function handleSearch(text) {
    let newStore = receiptsStore.filter((item) =>
      item.store_name.includes(text)
    );
    console.log(text, "search");
    console.log(newStore, " newstore");
    setFilterStore(newStore);
    setSearch(text);
  }
  useEffect(() => {
    handleSearch("");
  }, [receiptsStore]);
  return (
    <View className='flex-1 bg-zinc-900 '>
      <View className='flex-row justify-between items-center p-4 bg-zinc-900  '>
        <Text className='text-2xl font-bold text-white pt-10'>My Receipts</Text>
      </View>
      <View className='flex-row items-center bg-zinc-900 mx-4 my-4 p-2 rounded-lg'>
        <Search size={20} color='#ffffff' />
        <TextInput
          placeholder='Search receipts...'
          className='flex-1 ml-2 text-white'
          placeholderTextColor='#ffffff'
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      {receiptsStore == "" ? (
        <View className='bg-zinc-900 h-full w-full flex justify-center items-center px-6'>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600 }}
            className='flex items-center -top-40'
          >
            <View className='bg-zinc-800 rounded-full p-8 mb-8'>
              <Receipt size={80} color='#9CA3AF' />
            </View>
            <Text className='text-white text-4xl font-bold text-center mb-4'>
              No Receipts
            </Text>
            <Text className='text-zinc-400 text-lg text-center mb-8 max-w-xs'>
              You haven't added any receipts yet. Start tracking your expenses
              now!
            </Text>
            <TouchableOpacity
              className='bg-sky-500 py-4 px-8 rounded-full flex-row items-center'
              activeOpacity={0.8}
              onPress={() => router.replace("/(tabs)")}
            >
              <Text className='text-white font-semibold text-lg mr-2'>
                Add Receipt
              </Text>
              <View className='bg-sky-400 rounded-full p-1'>
                <Text className='text-white text-xl font-bold'>+</Text>
              </View>
            </TouchableOpacity>
          </MotiView>
        </View>
      ) : (
        <FlatList
          data={filterStore}
          renderItem={renderReceiptItem}
          keyExtractor={(item) => item.id}
          className='flex-1'
        />
      )}
    </View>
  );
}
