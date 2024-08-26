import { Stack, useRouter } from "expo-router";

import { IconButton } from "react-native-paper";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Add Transaction",
          presentation: "modal",
          animation: "slide_from_bottom",
          headerLeft: () => (
            <IconButton icon="close" size={20} onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Edit Transaction",
          presentation: "modal",
          animation: "slide_from_bottom",
          headerLeft: () => (
            <IconButton icon="close" size={20} onPress={() => router.back()} />
          ),
        }}
      />
    </Stack>
  );
}
