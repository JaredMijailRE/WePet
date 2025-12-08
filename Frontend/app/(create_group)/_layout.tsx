import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="group-config" />
      <Stack.Screen name="create_group" options={{ headerShown: false }} />
    </Stack>
  );
}