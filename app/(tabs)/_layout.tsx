import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          // headerTransparent: true,
          headerShadowVisible: false,
        }}
      />
      <Tabs.Screen
        name="stat"
        options={{
          title: "Stat",
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
