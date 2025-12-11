import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="group-settings" options={{ headerShown: false }} />
      <Stack.Screen name="pet" options={{ headerShown: false }} />
    </Stack>
  );
}
