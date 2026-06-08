import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useEffect, useState } from "react";
import { api, setAuthToken } from "../services/api";

export const AuthContext = createContext();

const TOKEN_KEY = "@gestao-financeira/token";
const USER_KEY = "@gestao-financeira/user";

/**
 * Provedor de autenticação.
 *
 * Mantém o token JWT + usuário logado, persiste no AsyncStorage e os
 * restaura ao abrir o app. Expõe ações de login, cadastro e logout.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // `restoring` cobre o tempo de leitura do AsyncStorage no início do app.
  const [restoring, setRestoring] = useState(true);

  // Restaura sessão salva ao montar.
  useEffect(() => {
    (async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (savedToken && savedUser) {
          setAuthToken(savedToken);
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch {
        // Sessão inválida/corrompida: começa deslogado.
      } finally {
        setRestoring(false);
      }
    })();
  }, []);

  const persistSession = useCallback(async (nextToken, nextUser) => {
    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
    await AsyncStorage.multiSet([
      [TOKEN_KEY, nextToken],
      [USER_KEY, JSON.stringify(nextUser)],
    ]);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { token: t, user: u } = await api.login({ email, password });
      await persistSession(t, u);
      return u;
    },
    [persistSession]
  );

  const register = useCallback(
    async (name, email, password) => {
      const { token: t, user: u } = await api.register({ name, email, password });
      await persistSession(t, u);
      return u;
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        restoring,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
