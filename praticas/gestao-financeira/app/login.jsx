import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../components/Button";
import { AuthContext } from "../contexts/AuthContext";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Tela de Login / Cadastro.
 *
 * Valida os campos no cliente (e-mail e senha mínima) e delega a
 * autenticação ao AuthContext. Após o sucesso, o AuthGate redireciona
 * automaticamente para o app.
 *
 * @returns {JSX.Element}
 */
export default function LoginScreen() {
  const { login, register } = useContext(AuthContext);

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (isRegister && name.trim().length < 2) {
      return showError("Informe seu nome (mín. 2 letras).");
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return showError("Informe um e-mail válido.");
    }
    if (password.length < 6) {
      return showError("A senha deve ter ao menos 6 caracteres.");
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      // AuthGate cuida do redirecionamento.
    } catch (e) {
      showError(e.message ?? "Não foi possível autenticar.");
    } finally {
      setSubmitting(false);
    }
  };

  const [errorMsg, setErrorMsg] = useState("");
  function showError(msg) {
    setErrorMsg(msg);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.logoBox}>
            <MaterialIcons
              name="account-balance-wallet"
              size={56}
              color={colors.primary}
            />
            <Text style={styles.title}>Gestão Financeira</Text>
            <Text style={styles.subtitle}>
              {isRegister
                ? "Crie sua conta para começar"
                : "Entre para acessar suas finanças"}
            </Text>
          </View>

          <View style={styles.form}>
            {isRegister && (
              <View>
                <Text style={globalStyles.inputLabel}>Nome</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome"
                  style={globalStyles.input}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View>
              <Text style={globalStyles.inputLabel}>E-mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="voce@email.com"
                style={globalStyles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View>
              <Text style={globalStyles.inputLabel}>Senha</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••"
                style={globalStyles.input}
                secureTextEntry
              />
            </View>

            {!!errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

            <View style={styles.submit}>
              {submitting ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <Button onPress={handleSubmit}>
                  {isRegister ? "Cadastrar" : "Entrar"}
                </Button>
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                setErrorMsg("");
                setMode(isRegister ? "login" : "register");
              }}
              style={styles.switchMode}
            >
              <Text style={styles.switchText}>
                {isRegister
                  ? "Já tenho conta — Entrar"
                  : "Não tem conta? Cadastre-se"}
              </Text>
            </TouchableOpacity>

            {!isRegister && (
              <Text style={styles.hint}>
                Conta de teste: demo@gestao.com / demo123
              </Text>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  logoBox: {
    alignItems: "center",
    marginBottom: 32,
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.primaryText,
  },
  form: {
    gap: 12,
  },
  submit: {
    marginTop: 8,
    minHeight: 44,
    justifyContent: "center",
  },
  error: {
    color: colors.negativeText,
    fontSize: 14,
  },
  switchMode: {
    alignItems: "center",
    paddingVertical: 8,
  },
  switchText: {
    color: colors.primary,
    fontWeight: "600",
  },
  hint: {
    textAlign: "center",
    color: colors.secondaryText,
    fontSize: 12,
  },
});
