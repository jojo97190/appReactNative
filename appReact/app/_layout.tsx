import { Stack } from "expo-router";
import { UserProvider } from "./usercontext.js";


export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </UserProvider>
  );
}

