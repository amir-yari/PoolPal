import { Stack } from "expo-router";

import { Provider } from "react-redux";

import { store, persistor } from "../store/store";

import { PersistGate } from "redux-persist/integration/react";

import {
  Provider as PaperProvider,
  MD3LightTheme,
  useTheme,
} from "react-native-paper";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "rgb(0, 102, 204)", // Primary Blue
    onPrimary: "rgb(255, 255, 255)", // White text on primary blue
    primaryContainer: "rgb(204, 229, 255)", // Light Blue
    onPrimaryContainer: "rgb(0, 51, 102)", // Darker Blue for contrast
    secondary: "rgb(51, 153, 255)", // Secondary Blue
    onSecondary: "rgb(255, 255, 255)", // White text on secondary blue
    secondaryContainer: "rgb(204, 229, 255)", // Light Blue
    onSecondaryContainer: "rgb(0, 51, 102)", // Darker Blue for contrast
    tertiary: "rgb(102, 178, 255)", // Tertiary Blue
    onTertiary: "rgb(0, 51, 102)", // Darker Blue for contrast
    tertiaryContainer: "rgb(240, 248, 255)", // Very Light Blue
    onTertiaryContainer: "rgb(0, 51, 102)", // Darker Blue for contrast
    error: "rgb(186, 26, 26)", // Error color
    onError: "rgb(255, 255, 255)", // White text on error color
    errorContainer: "rgb(255, 218, 214)", // Light error color
    onErrorContainer: "rgb(65, 0, 2)", // Darker error color for contrast
    background: "rgb(255, 255, 255)", // White background
    onBackground: "rgb(0, 0, 0)", // Black text on white background
    surface: "rgb(255, 255, 255)", // White surface
    onSurface: "rgb(0, 0, 0)", // Black text on white surface
    surfaceVariant: "rgb(240, 248, 255)", // Very Light Blue
    onSurfaceVariant: "rgb(0, 0, 51)", // Dark Blue for contrast
    outline: "rgb(153, 204, 255)", // Light Blue outline
    outlineVariant: "rgb(204, 229, 255)", // Light Blue variant
    shadow: "rgb(0, 0, 0)", // Black shadow
    scrim: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
    inverseSurface: "rgb(0, 0, 51)", // Dark Blue for inverse surface
    inverseOnSurface: "rgb(255, 255, 255)", // White text on dark blue
    inversePrimary: "rgb(204, 229, 255)", // Light Blue for inverse primary
    elevation: {
      level0: "transparent",
      level1: "rgb(240, 248, 255)", // Light Blue
      level2: "rgb(224, 238, 255)", // Slightly darker light blue
      level3: "rgb(204, 229, 255)", // Light Blue
      level4: "rgb(184, 219, 255)", // Medium Light Blue
      level5: "rgb(153, 204, 255)", // Light Blue
    },
    surfaceDisabled: "rgba(0, 0, 0, 0.12)", // Semi-transparent black
    onSurfaceDisabled: "rgba(0, 0, 0, 0.38)", // Semi-transparent black
    backdrop: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
  },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <PersistGate loading={null} persistor={persistor}>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="modal"
              options={{
                headerShown: false,
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
          </Stack>
        </PersistGate>
      </PaperProvider>
    </Provider>
  );
}
