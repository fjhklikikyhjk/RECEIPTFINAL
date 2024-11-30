import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useReceiptStore } from "../../store/receiptStore";
import { Camera, ScanBarcode } from "lucide-react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { MotiView } from "moti";

const AnimatedFontAwesomeIcon = () => {
  // Create a shared value for rotation
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Start the animation when the component mounts
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1 // Infinite repeat
    );
  }, []);

  // Animated style for rotation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle} className='absolute left-16'>
      <FontAwesome
        name='spinner'
        size={24}
        color='white'
        className='text-blue-500 '
      />
    </Animated.View>
  );
};

function CameraScreen() {
  const [image, setImage] = useState(false);
  let geturi;
  const { receiptsStore, addReceipt } = useReceiptStore();
  const [isProcessed, setIsProcessed] = useState(false);
  const fileUri = FileSystem.documentDirectory + "receipt.json";
  useEffect(() => {
    loadReceipts();
    receiptsStore;
    console.log("loaded form useEffect");
  }, []);

  async function saveReceipts(receipt) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      let existingReceipts = [];
      if (fileInfo.exists) {
        const data = await FileSystem.readAsStringAsync(fileUri);
        existingReceipts = JSON.parse(data || "[]");
      }
      if (Object.keys(receipt).length > 5) {
        let today = new Date();
        receipt.createdDay = today.toISOString().split("T")[0];

        const fileName = geturi.split("/").pop(); // Get the file name from the URI
        const destinationUri = `${FileSystem.documentDirectory}${fileName}`; // App's document directory
        await FileSystem.moveAsync({
          from: geturi,
          to: destinationUri,
        });

        receipt.uri = destinationUri;

        console.log(receipt, "saveReceipts");
        existingReceipts.push(receipt);
      }
      let revAarry = existingReceipts.reverse();
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(revAarry));
      console.log("Receipts saved successfully");
      loadReceipts();
    } catch (error) {
      console.error("Error saving receipts:", error);
    }
  }

  async function loadReceipts() {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      try {
        const data = await FileSystem.readAsStringAsync(fileUri);
        console.log(data);
        const receipts = JSON.parse(data);

        addReceipt(receipts);
      } catch (error) {
        console.error("Error loading receipts", error);
      }
    }
  }

  async function pickImageGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access gallery is required."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      geturi = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      setIsProcessed(true);
      await uploadToLambda(base64);
      // You might want to call openAiCall here if needed
    }
  }

  async function uploadToLambda(base64) {
    console.log("Uploading....");
    try {
      const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, "");

      const response = await fetch(
        "https://s7gsc0ee14.execute-api.us-east-2.amazonaws.com/receiptAIImage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imagefile: cleanBase64,
          }),
        }
      );

      const responseJson = await response.json();
      saveReceipts(responseJson);
      setIsProcessed(false);
      setImage(false);

      console.log(responseJson, "THIS IS MY response");
    } catch (error) {
      console.log(error);
      setIsProcessed(false);
      setImage(false);
    }
  }

  async function picCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access camera is required."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      geturi = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      console.log(base64, "base64");
      setIsProcessed(true);
      await uploadToLambda(base64);
    }
  }

  async function del() {
    console.log("deleted");
    await FileSystem.deleteAsync(fileUri);
  }

  return (
    <>
      <SafeAreaView className='flex-1 bg-zinc-900'>
        <View className='flex-1 px-4 py-6'>
          <View className='flex-row justify-between items-center mb-8'>
            <Text className='text-white text-2xl font-bold'>Scan Receipt</Text>
          </View>

          <View className='flex-1 justify-center h-96 items-center '>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 1000 }}
              className='items-center mb-14'
            >
              <Text className='text-4xl text-white font-bold mb-2'>
                Don't Wait
              </Text>
              <Text className='text-2xl text-sky-400 font-medium'>
                Track your receipts now
              </Text>
              <View className='h-1 w-20 bg-sky-500 mt-4 rounded-full' />
            </MotiView>
            {image ? (
              <View className='w-fit h-fit z-50 flex justify-center  items-center'>
                {isProcessed ? (
                  <>
                    <AnimatedFontAwesomeIcon />
                    <Text className=' absolute text-center w-full z-50  text-3xl text-white font-medium'>
                      Processing...
                    </Text>
                    <Image
                      source={{ uri: image }}
                      className='w-96 h-96 rounded-2xl   -z-50 mb-6'
                      resizeMode='cover'
                    />
                  </>
                ) : null}
              </View>
            ) : (
              <View className='w-full h-96 bg-zinc-800 rounded-2xl mb-6 justify-center items-center'>
                <Text className='text-zinc-500 text-lg'>No image selected</Text>
              </View>
            )}

            <View className='w-full flex-row justify-between mt-6'>
              <Pressable
                onPress={pickImageGallery}
                className='bg-zinc-800 px-6 py-4 rounded-xl flex-row items-center justify-center flex-1 mr-2'
              >
                <Camera size={24} color='#fff' className='mr-2' />
                <Text className='text-white text-lg font-semibold'>
                  Gallery
                </Text>
              </Pressable>
              <Pressable
                onPress={picCamera}
                className='bg-white px-6 py-4 rounded-xl flex-row items-center justify-center flex-1 ml-2'
              >
                <ScanBarcode size={24} color='#000' className='mr-2' />
                <Text className='text-black text-lg font-semibold'>Scan</Text>
              </Pressable>
            </View>
          </View>

          <View className='mt-8'>
            <Text className='text-zinc-400 text-center'>
              Scan your receipt or select an image from your gallery to process
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

export default CameraScreen;
