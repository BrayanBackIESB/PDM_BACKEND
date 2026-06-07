# 💻 Aula 05: Estado Global e Persistência de Dados (Context API e AsyncStorage)

Até agora, conseguimos preencher o formulário perfeitamente, mas os dados estão presos na tela de "Adicionar" e somem assim que o aplicativo é reiniciado. Nesta aula, vamos resolver esses dois problemas usando a **Context API** do React (para compartilhar dados entre todas as abas) e o **AsyncStorage** (para salvar na memória do celular).



## 🎯 Objetivos da Aula
* Entender por que precisamos de um estado global (evitar *Prop Drilling*).
* Criar um contexto usando `createContext` e `Provider`.
* Envolver a aplicação com o Estado Global no Root Layout.
* Instalar e usar o `@react-native-async-storage/async-storage`.
* Salvar e recuperar dados do armazenamento local.

---

## 🌐 Passo 1: Criando o Estado Global (Context API)
Como nossas três telas precisam ver a mesma lista de transações, precisamos de um "guarda-chuva" que segure esses dados para toda a aplicação.

Crie uma pasta chamada `contexts` na raiz do projeto e adicione o arquivo `GlobalState.jsx`. Nele, vamos criar nosso contexto e também já deixar preparado o código que vai buscar as informações salvas no celular ao abrir o app:

```javascript
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useEffect, useState } from "react"

export const MoneyContext = createContext()

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const getAsyncStorage = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem("transactions")
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions))
        }
      } catch (e) {
        console.log(e)
      }
    }
    getAsyncStorage()
  }, [])

  return (
    <MoneyContext.Provider value={[transactions, setTransactions]}>
      {children}
    </MoneyContext.Provider>
  )
}
```
### ☂️ Passo 2: Envolvendo a Aplicação com o Contexto
Para que o `MoneyContext` funcione, ele precisa abraçar toda a nossa árvore de navegação. Abra o arquivo `app/_layout.jsx` (ou `RootLayout`) e envolva o `<Stack>` com o seu novo `GlobalState`:

```jsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";
import GlobalState from "../contexts/GlobalState";

export default function RootLayout() {
  return (
    // Agora todas as telas dentro do Stack tem acesso ao Contexto!
    <GlobalState>
      <StatusBar backgroundColor={colors.primary} style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </GlobalState>
  );
}
```
### 💾 Passo 3: Instalando o AsyncStorage
Pare o servidor no seu terminal (`Ctrl+C`) e instale a biblioteca de armazenamento local do React Native:
```bash
npx expo install @react-native-async-storage/async-storage
```
*Depois de instalar, rode `npm run android` novamente.*

### ➕ Passo 4: Salvando Transações de Verdade
Agora vamos atualizar nossa tela de formulário (`app/(tabs)/add-transactions.jsx`). Em vez de apenas dar um `Alert`, vamos puxar as transações do contexto, adicionar a nova, atualizar o contexto e salvar no `AsyncStorage`.

```jsx
import { View, ScrollView, Alert, StyleSheet, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import Button from "../../components/Button";
import { useContext, useRef, useState } from "react";
import DescriptionInput from "../../components/DescriptionInput";
import CurrencyInput from "../../components/CurrencyInput";
import DatePicker from "../../components/DatePicker";
import CategoryPicker from "../../components/CategoryPicker";
import { MoneyContext } from "../../contexts/GlobalState";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialForm = {
  description: "",
  value: 0,
  date: new Date(),
  category: "Renda",
};

export default function AddTransactions() {
  const [form, setForm] = useState(initialForm);
  const valueInputRef = useRef();
  
  // Consumindo o estado global!
  const [transactions, setTransactions] = useContext(MoneyContext);

  const setAsyncStorage = async (data) => {
    try {
      // O AsyncStorage exige que salvemos objetos/arrays como String
      await AsyncStorage.setItem("transactions", JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  };

  const addTransaction = async () => {
    // Cria a transação gerando um ID baseado no tamanho da lista
    const newTransaction = { id: transactions.length + 1, ...form };
    const updatedTransactions = [...transactions, newTransaction];

    setTransactions(updatedTransactions); // Atualiza a memória RAM (Contexto)
    setForm(initialForm);                 // Limpa o formulário
    await setAsyncStorage(updatedTransactions); // Atualiza a memória do Celular (Storage)

    Alert.alert("Sucesso!", "Transação adicionada com sucesso!");
  };

  return (
    <KeyboardAvoidingView style={globalStyles.screenContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={globalStyles.content}>
          <View style={styles.form}>
            <DescriptionInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
            <CurrencyInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
            <DatePicker form={form} setForm={setForm} />
            <CategoryPicker form={form} setForm={setForm} />
          </View>
          <Button onPress={addTransaction}>Adicionar</Button>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12, marginBottom: 40, marginTop: 10 },
});
```
### 🔍 Passo 5: Testando o Consumo do Contexto
Para testar se tudo deu certo, vá até a tela inicial (`app/(tabs)/index.jsx`), que será a nossa lista de transações, e puxe o contexto apenas para imprimir a descrição do primeiro item:

```jsx
import { MoneyContext } from "../../contexts/GlobalState";
import { useContext } from "react";
import { Text } from "react-native";

export default function Transactions() {
  const [transactions] = useContext(MoneyContext);

  // Exibe a descrição do primeiro item da lista (posição 0), se existir (?)
  return <Text>{transactions[0]?.description}</Text>;
}
```
✅ **O que alcançamos hoje?**
Seu aplicativo ganhou memória permanente! Agora, você pode adicionar transações, fechar completamente o aplicativo (arrastando para cima no celular) e, ao abrir novamente, as transações ainda estarão lá, sendo lidas direto do armazenamento interno.

**Próximo Passo:** Com os dados garantidos no estado global, nossa próxima missão é transformar aquela aba de Transações em uma linda lista usando a `<FlatList>` do React Native para exibir tudo o que cadastramos!