import AsyncStorage from "@react-native-async-storage/async-storage";

export const clearAllAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("All AsyncStorage data has been cleared.");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

clearAllAsyncStorage();
