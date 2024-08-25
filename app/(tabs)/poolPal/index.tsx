import { useEffect, useState } from "react";

import { View, StyleSheet } from "react-native";

import { Avatar, Card, FAB, Text } from "react-native-paper";

import { useRouter } from "expo-router";

import { useTransactionSelector } from "../../../store/hooks";

// import AsyncStorage from "@react-native-async-storage/async-storage";
// export const clearAllAsyncStorage = async () => {
//   try {
//     await AsyncStorage.clear();
//     console.log("All AsyncStorage data has been cleared.");
//   } catch (error) {
//     console.error("Error clearing AsyncStorage:", error);
//   }
// };

// clearAllAsyncStorage();

const Tab = () => {
  const router = useRouter();

  const transactions = useTransactionSelector(
    (state) => state.transaction.items
  );
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const totalBalance = transactions.reduce((acc, transaction) => {
      const amount =
        transaction.type === "income"
          ? transaction.amount
          : -transaction.amount;
      return acc + amount;
    }, 0);

    setBalance(totalBalance);
  }, [transactions]);

  return (
    <>
      <View className="flex-1">
        <View className="h-72">
          <Card style={{ margin: 16 }}>
            <Card.Title
              title="Current Balance"
              left={() => <Avatar.Icon size={50} icon="cash-multiple" />}
            />
            <Card.Content>
              <Text variant="titleLarge">${balance.toFixed(2)}</Text>
            </Card.Content>
          </Card>
        </View>
      </View>
      <FAB
        icon="plus"
        style={styles.fab}
        color="black"
        onPress={() => router.push("/modal")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 150,
    bottom: 0,
  },
});

export default Tab;
