import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(main_nav)" options={{ headerShown: false }} />
      <Stack.Screen name="(create_group)" options={{ headerShown: false }}/>
      <Stack.Screen name="(pet_service)" options={{ headerShown: false }} />
    </Stack>
  )
}
