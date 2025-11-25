import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(group)" options={{ headerShown: false }} />
    </Stack>
  )
}
