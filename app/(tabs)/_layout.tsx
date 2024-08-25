import { Tabs } from "expo-router";

import { Avatar } from "react-native-paper";

export default function TabLayout() {
  return (
    <Tabs initialRouteName="poolPal">
      <Tabs.Screen
        name="poolPal"
        options={{
          title: "PoolPal",
          headerShown: false,
          tabBarIcon: () => (
            <Avatar.Icon
              icon={"home"}
              size={40}
              style={{ backgroundColor: "white", marginTop: 10 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          headerShown: false,
          tabBarIcon: () => (
            <Avatar.Icon
              icon={"cash"}
              size={40}
              style={{ backgroundColor: "white", marginTop: 10 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
