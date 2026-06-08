import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "../constants/colors";
import AuthProvider, { AuthContext } from "../contexts/AuthContext";
import GlobalState from "../contexts/GlobalState";

/**
 * Controla o roteamento conforme o estado de autenticação:
 *  - sem sessão  -> manda para /login;
 *  - com sessão  -> mantém o usuário fora da tela de login.
 */
function AuthGate({ children }) {
  const { isAuthenticated, restoring } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (restoring) return;
    const inLogin = segments[0] === "login";

    if (!isAuthenticated && !inLogin) {
      router.replace("/login");
    } else if (isAuthenticated && inLogin) {
      router.replace("/");
    }
  }, [isAuthenticated, restoring, segments, router]);

  if (restoring) {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return children;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <GlobalState>
        <StatusBar backgroundColor={colors.primary} style="light" />
        <AuthGate>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthGate>
      </GlobalState>
    </AuthProvider>
  );
}
