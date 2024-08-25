import { Stack, useRouter } from "expo-router";

import { IconButton } from "react-native-paper";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Transactions",
          headerRight: () => (
            <IconButton
              icon="chart-pie"
              size={20}
              onPress={() => router.push("/(tabs)/transactions/stat")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="stat"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
}
