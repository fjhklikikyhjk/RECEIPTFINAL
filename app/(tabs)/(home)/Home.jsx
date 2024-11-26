import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { PlusCircle, ChevronRight, Search } from "lucide-react-native";
import { Link } from "expo-router";
import { useReceiptStore } from "../../../store/receiptStore";

export default function ReceiptList() {
  const { receiptsStore } = useReceiptStore();
  const [filterStore, setFilterStore] = useState();
  const [search, setSearch] = useState("");
  const [todaysDate, setTodaysDate] = useState("");

  useEffect(() => {
    let today = new Date();
    let createdDay = today.toISOString().split("T")[0];
    setTodaysDate(createdDay);
  }, []);

  const renderReceiptItem = ({ item }) => (
    <TouchableOpacity
      className={`flex-row justify-between h-fit  items-center ${
        item.createdDay === todaysDate ? "bg-sky-950" : "bg-zinc-800"
      } mx-4 mb-2  rounded-lg shadow`}
    >
      <Link
        href={{
          pathname: "[id] ",
          params: { id: item.id },
        }}
        className=' w-screen z-50  h-full flex-row justify-end p-4  items-end gap-3'
      >
        <View className='flex-1'>
          <Text className='text-base font-bold text-white'>
            {item.store_name}
          </Text>
          <Text className='text-sm text-white mt-1'>{item.date}</Text>
        </View>
      </Link>
      <View className='flex-row items-center absolute right-4'>
        <Text className='text-base font-bold text-green-300 mr-2 '>
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
    <View className='flex-1 bg-zinc-900'>
      <View className='flex-row justify-between items-center p-4 bg-zinc-900 '>
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
        <Text className='text-white text-center mt-24 text-4xl w-fit h-fit'>
          No Receipts
        </Text>
      ) : (
        <FlatList
          data={filterStore?.toReversed()}
          renderItem={renderReceiptItem}
          keyExtractor={(item) => item.id}
          className='flex-1'
        />
      )}
    </View>
  );
}
