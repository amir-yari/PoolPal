import { Stack, useRouter } from "expo-router";

import { IconButton } from "react-native-paper";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "PoolPal",
        }}
      />
    </Stack>
  );
}
