import { View, Text, ScrollView, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useReceiptStore } from "../../../store/receiptStore";
import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";

const MyReceipts = () => {
  const { receiptsStore, addReceipt } = useReceiptStore();
  const [rightReceipt, setRightReceipt] = useState(null);
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const fileUri = FileSystem.documentDirectory + "receipt.json";
  useEffect(() => {
    function getRightItem() {
      let result = receiptsStore.filter((item) => item.id === id);
      setRightReceipt(result[0]);
    }
    getRightItem();
  }, [id, receiptsStore]);

  async function deleteObject(id) {
    setIsLoading(false);
    const fileContent = await FileSystem.readAsStringAsync(fileUri);

    try {
      const data = JSON.parse(fileContent);
      console.log(data);
      const newdata = data.filter((item) => item.id !== id);
      addReceipt(newdata);
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(newdata));

      console.log("Object deleted successfully");
      router.back();
    } catch (error) {
      console.error("Error Deleting object form file", error);
    }
  }

  const ItemRow = ({ item }) => (
    <View className='flex-row justify-between py-2 border-b border-zinc-800/30'>
      <View className='flex-row gap-4'>
        <Text className='text-zinc-400 w-8'>{item.quantity || 1}</Text>
        <Text className='text-zinc-300 flex-1'>{item.item}</Text>
      </View>
      <Text className='text-zinc-300'>${item.price}</Text>
    </View>
  );

  if (!rightReceipt) {
    return (
      <View className='bg-zinc-900 h-full pt-20 justify-center items-center '>
        {isLoading ? (
          <Text className='text-zinc-300'>Loading...</Text>
        ) : (
          <Text className='text-zinc-300'>Deleted</Text>
        )}
      </View>
    );
  }

  return (
    <View className='bg-zinc-900 h-full pt-20 '>
      <ScrollView>
        <View className='m-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 shadow-lg shadow-zinc-900/50 overflow-hidden'>
          {/* Diagonal pattern overlay */}
          <View className='absolute inset-0 opacity-5'>
            <View
              className='w-full h-full'
              style={{
                backgroundColor: "#ffffff",
                backgroundImage:
                  "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)",
                backgroundSize: "10px 10px",
              }}
            />
          </View>

          <View className='px-6 py-8'>
            {/* Store Info Section */}
            <View className='items-center space-y-2 mb-8 border-b border-zinc-700/50 pb-6'>
              <Text className='text-zinc-300 text-xl font-medium'>
                {rightReceipt?.store_name || "Store Name"}
              </Text>
              <Text className='text-zinc-400 text-sm'>
                {rightReceipt?.location || "Location"}
              </Text>
              <Text className='text-zinc-400 text-sm'>
                {rightReceipt?.phone_number || "Phone Number"}
              </Text>
              <Text className='text-zinc-400 text-xs'>
                Receipt #{rightReceipt?.id}
              </Text>
            </View>

            {/* Items List */}
            <View className='mb-6'>
              {rightReceipt?.items?.map((item, index) => (
                <ItemRow key={index} item={item} />
              ))}
            </View>

            {/* Totals Section */}
            <View className='space-y-3 pt-4 border-t border-zinc-700/50'>
              <View className='flex-row justify-between'>
                <Text className='text-zinc-400'>Subtotal</Text>
                <Text className='text-zinc-300'>
                  ${rightReceipt?.total || "0.00"}
                </Text>
              </View>
              <View className='flex-row justify-between'>
                <Text className='text-zinc-400'>Tax</Text>
                <Text className='text-zinc-300'>
                  ${rightReceipt?.tax || "0.00"}
                </Text>
              </View>
              <View className='flex-row justify-between pt-2 border-t border-zinc-700/50'>
                <Text className='text-zinc-300 font-medium'>Total</Text>
                <Text className='text-zinc-300 font-medium'>
                  ${rightReceipt?.total || "0.00"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className='w-screen h-fit flex items-center justify-center'>
          <Pressable
            className='w-44 h-fit p-6 bg-red-700 rounded-md mb-56'
            onPress={() => deleteObject(rightReceipt?.id)}
          >
            <Text className='text-center'>DELETE</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyReceipts;
