# 💻 Aula 04: Componentização, UX de Formulários e Teclado

Nesta aula, vamos dar um "banho de loja" no nosso código. O arquivo `AddTransactions.jsx` está ficando gigante e misturando muita responsabilidade. Vamos transformá-lo em um código limpo (Clean Code) dividindo os inputs em componentes menores. Além disso, vamos implementar melhorias vitais de UX (Experiência do Usuário) para lidar com o teclado do celular.

## 🎯 Objetivos da Aula
* Componentizar todos os inputs (`CategoryPicker`, `DatePicker`, `CurrencyInput`, `DescriptionInput`).
* Esconder a Tab Bar quando o teclado abrir (`tabBarHideOnKeyboard`).
* Prevenir que o teclado cubra o formulário usando `KeyboardAvoidingView`.
* Fechar o teclado ao tocar fora do formulário usando `TouchableWithoutFeedback`.
* Melhorar o fluxo de digitação usando `useRef` para pular para o próximo campo ao apertar "Enter" (Next).

---

## 🧱 Passo 1: Criando os Componentes (Lego)
Crie os arquivos abaixo dentro da sua pasta `components/`. Eles serão os nossos "blocos de montar". Repare que passamos `form` e `setForm` como propriedades (`props`) para que eles consigam alterar o estado centralizado que ficará na tela principal.

### 1. `components/Button.jsx`
```javascript
import { StyleSheet, Text } from "react-native";
import { TouchableHighlight } from "react-native";
import { colors } from "../constants/colors";

export default function Button({ children, onPress }) {
  return (
    <TouchableHighlight style={style.background} onPress={onPress}>
      <Text style={style.text}>{children}</Text>
    </TouchableHighlight>
  );
}

const style = StyleSheet.create({
  background: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.primaryContrast,
    fontSize: 18,
    fontWeight: "600",
  },
});
```
2. `components/DescriptionInput.jsx`
*Atenção aqui para o `returnKeyType="next"` e o `onSubmitEditing`. Eles são os responsáveis por mandar o cursor para o próximo input!*

```js
import { Text, TextInput, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"

export default function DescriptionInput({ form, setForm, valueInputRef }) {
  return (
    <View>
      <Text style={globalStyles.inputLabel}>Descrição</Text>
      <TextInput
        value={form.description}
        returnKeyType="next"
        onChangeText={(text) => setForm({ ...form, description: text })}
        onSubmitEditing={() => valueInputRef.current.focus()}
        style={globalStyles.input}
      />
    </View>
  )
}
```
3. `components/CurrencyInput.jsx`
*Recebe a `valueInputRef` para focar neste campo quando o anterior for preenchido.*

```js
import { Text, TextInput, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"

export default function CurrencyInput({ form, setForm, valueInputRef }) {
  const handleCurrencyChange = (text) => {
    const formattedValue = text.replace(/\D/g, "")
    const numberValue = formattedValue ? parseFloat(formattedValue) / 100 : 0

    setForm({ ...form, value: numberValue })
  }

  return (
    <View>
      <Text style={globalStyles.inputLabel}>Valor</Text>
      <TextInput
        ref={valueInputRef}
        value={form.value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })}
        onChangeText={handleCurrencyChange}
        keyboardType="numeric"
        style={globalStyles.input}
      />
    </View>
  )
}
```
4. `components/DatePicker.jsx`
```jsx
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { useState } from "react"
import RNDateTimePicker from "@react-native-community/datetimepicker"

export default function DatePicker({ form, setForm }) {
  const [showPicker, setShowPicker] = useState(false)

  const handleDateChange = (_, selectDate) => {
    setShowPicker(false)

    if (selectDate) {
      setForm({ ...form, date: selectDate })
    }
  }

  return (
    <View>
      <Text style={globalStyles.inputLabel}>Data</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput
          value={form.date.toLocaleDateString("pt-BR")}
          onChangeText={(text) => setForm({ ...form, date: text })}
          style={globalStyles.input}
          editable={false}
        />
      </TouchableOpacity>

      {showPicker && (
        <RNDateTimePicker
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          value={form.date}
          onChange={handleDateChange}
        />
      )}
    </View>
  )
}
```
5. `components/CategoryPicker.jsx`
```jsx
import { Picker } from "@react-native-picker/picker"
import { StyleSheet, Text, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { colors } from "../constants/colors"
import { categories } from "../constants/categories"

export default function CategoryPicker({ form, setForm }) {
  return (
    <View>
      <Text style={globalStyles.inputLabel}>Categoria</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={form.category}
          onValueChange={(itemValue) => setForm({ ...form, category: itemValue })}
        >
          <Picker.Item label={categories.income.displayName} value={categories.income.name} />
          <Picker.Item label={categories.food.displayName} value={categories.food.name} />
          <Picker.Item label={categories.house.displayName} value={categories.house.name} />
          <Picker.Item label={categories.education.displayName} value={categories.education.name} />
          <Picker.Item label={categories.travel.displayName} value={categories.travel.name} />
        </Picker>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  picker: {
    display: "flex",
    justifyContent: "center",
    height: 44,
    borderColor: colors.secondaryText,
    borderWidth: 1,
    borderRadius: 8,
    flexGrow: 1
  }
})
```
## 📱 Passo 2: Montando o Quebra-Cabeça (A Tela Principal)
Agora que temos todos os nossos componentes menores, o arquivo `app/(tabs)/add-transactions.jsx` ficará incrivelmente limpo. É aqui que implementaremos o `KeyboardAvoidingView` (para a tela subir com o teclado) e o `TouchableWithoutFeedback` (para fechar o teclado ao clicar fora).

```jsx
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import Button from "../../components/Button";
import { useRef, useState } from "react";
import DescriptionInput from "../../components/DescriptionInput";
import CurrencyInput from "../../components/CurrencyInput";
import DatePicker from "../../components/DatePicker";
import CategoryPicker from "../../components/CategoryPicker";

const initialForm = {
  description: "",
  value: 0,
  date: new Date(),
  category: "Renda",
};

export default function AddTransactions() {
  const [form, setForm] = useState(initialForm);
  const valueInputRef = useRef();

  const addTransaction = () => {
    Alert.alert(
      "Dados Prontos!",
      `${form.description} | ${form.value} | ${form.date.toLocaleDateString()} | ${form.category}`
    );
  };

  return (
    <KeyboardAvoidingView style={globalStyles.screenContainer} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={globalStyles.content}>
          <View style={styles.form}>
            <DescriptionInput
              form={form}
              setForm={setForm}
              valueInputRef={valueInputRef}
            />
            <CurrencyInput
              form={form}
              setForm={setForm}
              valueInputRef={valueInputRef}
            />
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
  form: {
    gap: 12,
    marginBottom: 40,
    marginTop: 10,
  },
});
```
*Nota Extra: Não se esqueça de ir no arquivo de rotas (`app/(tabs)/_layout.jsx`) e adicionar `tabBarHideOnKeyboard: true` nas opções do seu `<Tabs>` para que a barra de navegação se esconda quando o teclado subir!*

✅ **O que alcançamos hoje?**
Nosso código está limpo, reutilizável e a experiência de preencher o formulário está no padrão de aplicativos profissionais, com gestão inteligente de teclado!

**Próximo Passo:** O formulário está pronto, mas o `Alert` não salva nada de verdade. Na próxima aula, vamos implementar o **Context API** para compartilhar os dados entre as abas e o **AsyncStorage** para persistir as informações no banco de dados local do celular.