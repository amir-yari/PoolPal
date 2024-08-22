import { router, Tabs } from "expo-router";

import { IconButton } from "react-native-paper";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "PoolPal",
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          headerRight: () => (
            <IconButton
              icon="chart-pie"
              size={20}
              onPress={() => router.push("/stat/")}
            />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
