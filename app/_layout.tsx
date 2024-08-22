import { Stack, useRouter } from "expo-router";

import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";

import { IconButton, Provider as PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const router = useRouter();
  return (
    <Provider store={store}>
      <PaperProvider>
        <PersistGate loading={null} persistor={persistor}>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                title: "",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="modal/index"
              options={{
                title: "Add Transaction",
                presentation: "modal",
                animation: "slide_from_bottom",
                headerLeft: () => (
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => router.back()}
                  />
                ),
              }}
            />
          </Stack>
        </PersistGate>
      </PaperProvider>
    </Provider>
  );
}
