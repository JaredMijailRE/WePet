import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(main_nav)" options={{ headerShown: false }} />
    </Stack>
  )
}
