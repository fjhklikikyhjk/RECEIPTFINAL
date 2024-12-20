import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useReceiptStore } from "../../../store/receiptStore";
import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";

const MyReceipts = () => {
  const { receiptsStore, addReceipt } = useReceiptStore();
  const [rightReceipt, setRightReceipt] = useState(null);
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isexpand, setIsexpand] = useState(false);
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
    console.log("pressed delete");
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

  async function editObject() {
    console.log(text);
    const fileContent = await FileSystem.readAsStringAsync(fileUri);

    try {
      const data = JSON.parse(fileContent);
      console.log(data);

      const newdata = data.map((item) => {
        if (item.id === id) {
          itemkey = text;
        }
      });

      addReceipt(newdata);
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(newdata));

      console.log("Object Edited successfully");
      router.back();
    } catch (error) {
      console.error("Error Deleting object form file", error);
    }
  }

  const ItemRow = ({ item }) => (
    <View className='flex-row justify-between py-2 border-b border-zinc-800/30'>
      <View className='flex-row gap-4'>
        <TextInput
          onChangeText={() => editObject(id, item.quantity)}
          className='text-zinc-400 w-8'
        >
          {item.quantity || 1}
        </TextInput>
        <TextInput className='text-zinc-300 -left-6 text-wrap w-72  '>
          {item.item}
        </TextInput>
      </View>
      <TextInput className='text-zinc-300'>${item.price}</TextInput>
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
    <View className='bg-zinc-900 h-full pt-20 -z-50 '>
      <ScrollView className='-z-50'>
        <Pressable onPress={() => setIsexpand(!isexpand)}>
          <Image
            source={{ uri: rightReceipt?.uri }}
            className={`w-11/12 items-centers ml-4 mt-3 ${
              isexpand ? "h-[500px]" : "h-44"
            } rounded-3xl`}
          />
        </Pressable>
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
                  ${rightReceipt?.subtotal || "0.00"}
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
        <View className='w-screen h-fit flex items-center -z-50 justify-center mb-56'>
          <Pressable
            className='w-44 h-fit p-6 py-7 mt-3 z-50  bg-white rounded-md '
            onPress={() => deleteObject(rightReceipt?.id)}
          >
            <Text className='text-center z-50 '>DELETE</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyReceipts;
