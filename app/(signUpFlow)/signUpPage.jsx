import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import "react-native-url-polyfill/auto";
import * as React from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();
export default function AuthScreen() {
  const SUPABASE_URL = "https://dgiccoypzfmludulwvwx.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnaWNjb3lwemZtbHVkdWx3dnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3ODk0MTYsImV4cCI6MjA0ODM2NTQxNn0.tYOJj86nS6G0gjA-1hllDK4jOefjsfFgepqzWpOI0ag";

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  const router = useRouter();

  // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  //   clientId:
  //     "29824654421-khp3s6fnkm5kn4v6lrll9u8lgn6cvqpb.apps.googleusercontent.com",
  //   iosClientId:
  //     "29824654421-6392kpj1semi4c19233lsphcvrjvavbc.apps.googleusercontent.com",
  //   redirectUri: redirectUri,
  // });

  // // const discovery = {
  // //   authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  // //   tokenEndpoint: "https://oauth2.googleapis.com/token",
  // // };

  // // const [request, response, promptAsync] = AuthSession.useAuthRequest(
  // //   {
  // //     clientId:
  // //       "29824654421-khp3s6fnkm5kn4v6lrll9u8lgn6cvqpb.apps.googleusercontent.com",
  // //     scopes: ["openid", "profile", "email"],
  // //     redirectUri: AuthSession.makeRedirectUri({
  // //       useProxy: true,
  // //     }),
  // //   },
  // //   discovery
  // // );
  // // console.log(response, request);

  // useEffect(() => {
  //   console.log(request, "Request", response, "response");

  //   const handleGoogleAuth = async () => {
  //     if (response?.type === "success") {
  //       const { authentication } = response;

  //       try {
  //         // Exchange Google token with Supabase
  //         const { data, error } = await supabase.auth.signInWithOAuth({
  //           provider: "google",
  //           options: {
  //             // Use the access token from Google
  //             accessToken: authentication?.accessToken,
  //             idToken: authentication?.idToken,
  //           },
  //         });

  //         if (error) {
  //           console.error("Supabase Auth Error:", error);
  //           return;
  //         }

  //         // User is now logged in
  //         console.log("Logged in user:", data.user);
  //         router.replace("/(home)/Home"); // Navigate to home screen
  //       } catch (err) {
  //         console.error("Authentication Error:", err);
  //       }
  //     }
  //   };

  //   handleGoogleAuth();
  // }, [response]);

  const HandleAppleAuth = () => {
    // Only allow Apple Sign-In on iOS
    if (Platform.OS === "ios")
      return (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={
            AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
          }
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={10}
          style={{ width: 370, height: 50 }}
          onPress={async () => {
            try {
              const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
              });
              console.log(credential);
              // Sign in via Supabase Auth.
              router.replace("/(tabs)");
              if (credential.identityToken) {
                const {
                  error,
                  data: { user },
                } = await supabase.auth.signInWithIdToken({
                  provider: "apple",
                  token: credential.identityToken,
                });
                console.log(JSON.stringify({ error, user }, null, 2));
                if (!error) {
                  // User is signed in.

                  console.log("isSginIN");
                  Alert.alert(
                    "Confirmation",
                    "Are you sure you want to proceed?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => console.log("OK Pressed"),
                      },
                    ]
                  );
                }
              } else {
                throw new Error("No identityToken.");
              }
            } catch (e) {
              if (e.code === "ERR_REQUEST_CANCELED") {
                // handle that the user canceled the sign-in flow
              } else {
                // handle other errors
              }
            }
          }}
        />
      );

    console.log("Apple auth pressed");
  };

  return (
    <SafeAreaView className='flex-1 bg-sky-500'>
      <View className='flex-1 px-6 py-8  justify-between '>
        <View className='justify-center items-center pt-10 -pb-3'>
          <Text className='text-white text-4xl font-bold mb-4'>
            Welcome To ReceiptWise
          </Text>
          <Text className='text-white text-lg mb-8'>
            Sign in to start tracking your expenses
          </Text>
        </View>

        <View className='space-y-7'>
          <HandleAppleAuth />
          {/* <TouchableOpacity className='bg-sky-500 flex-row items-center justify-center py-4 px-6 rounded-xl'>
              <Text className='text-white text-lg font-semibold'>
                Continue with Apple
              </Text>
            </TouchableOpacity> */}
          {/* <TouchableOpacity
            onPress={() => {
              promptAsync({ useProxy: true });
            }}
            className='bg-white flex-row items-center justify-center mt-4 py-4 px-6 rounded-xl'
          >
            <LogIn size={24} color='#000000' className='mr-2' />
            <Text className='text-black text-lg font-semibold'>
              Continue with Google
            </Text>
          </TouchableOpacity> */}
        </View>

        <View className='mt-8'>
          <Text className='text-white text-center text-sm'>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
