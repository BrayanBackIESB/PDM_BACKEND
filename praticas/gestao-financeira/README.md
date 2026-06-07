# 💻 Aula 03: Formatação de Moeda, DatePicker e Dropdown Nativo

O nosso formulário de "Adicionar Transação" está ganhando vida! Na aula passada, conectamos todos os campos a um estado centralizado. Hoje, vamos transformar os inputs simples de Data e Categoria em componentes nativos e criar uma máscara de dinheiro real para o campo de Valor.

## 🎯 Objetivos da Aula
* Criar uma máscara de formatação para R$ (Reais) usando Regex.
* Instalar e configurar a biblioteca `@react-native-community/datetimepicker` para seleção de datas.
* Instalar e configurar a biblioteca `@react-native-picker/picker` para o dropdown de categorias.
* Transformar objetos de Data em Strings legíveis para o usuário (`pt-BR`).

## 💰 Passo 1: Máscara de Dinheiro (Currency Input)
Queremos que o usuário digite números e veja a formatação "R$ 10.000,00" na tela, mas queremos salvar no estado apenas o número `10000.00` para facilitar os cálculos depois.

Para isso, vamos criar uma função `handleCurrencyChange`:

```javascript
const handleCurrencyChange = (text) => {
  // 1. Regex Mágico: Remove tudo o que NÃO for número (letras, R$, vírgulas)
  const formattedValue = text.replace(/\D/g, "");

  // 2. Transforma em número decimal (divide por 100 para criar os centavos)
  const numberValue = formattedValue ? parseFloat(formattedValue) / 100 : 0;

  // 3. Salva no estado
  setForm({ ...form, value: numberValue });
};
```

## 📅 Passo 2: O DatePicker Nativo
No React Native, não existe um input `<input type="date">` como na Web. Precisamos usar a biblioteca da comunidade para chamar o calendário nativo do Android ou a roleta do iOS.

1. **Instalação:** Pare o servidor e rode no terminal:
```bash
npx expo install @react-native-community/datetimepicker
```
2. **Estado de Controle:** Precisamos de um `useState` para saber se o calendário está aberto: `const [showPicker, setShowPicker] = useState(false)`;
3. **Botão Falso:** O input de data não será mais editável. Colocaremos ele dentro de um `TouchableOpacity` que muda o `showPicker` para `true`.
4. **Tratando Plataformas:** Vamos usar o `Platform.OS === "ios" ? "inline" : "default"` para garantir que o componente se comporte bem em ambos os sistemas.

## 🗂️ Passo 3: Dropdown de Categorias (Picker)
Para a Categoria, não queremos que o usuário digite, queremos que ele escolha de uma lista fixa.

Crie um arquivo chamado `categories.js` dentro da pasta `constants`
```js
import { colors } from "./colors"

export const categories = {
  income: {
    icon: "work",
    background: colors.categoryIncome,
    name: "income",
    displayName: "Renda"
  },
  food: {
    icon: "fastfood",
    background: colors.categoryFood,
    name: "food",
    displayName: "Alimentação"
  },
  house: {
    icon: "home",
    background: colors.categoryHouse,
    name: "house",
    displayName: "Casa"
  },
  education: {
    icon: "book",
    background: colors.categoryEducation,
    name: "education",
    displayName: "Educação"
  },
  travel: {
    icon: "airplanemode-active",
    background: colors.categoryTravel,
    name: "travel",
    displayName: "Viagens"
  }
}
```

1. **Instalação:** Rode no terminal:
```bash
npx expo install @react-native-picker/picker
```
2. **Dicionário de Categorias:** Lembre-se de usar o objeto exportado do arquivo `constants/categories.js`.
3. **Estilização:** O Picker nativo deve ser envolvido em uma `<View>` com bordas para ficar parecido com os outros inputs.

## 🧩 Passo 4: Juntando Tudo (Código Final da Tela)
Aqui está o código completo do nosso arquivo `add-transactions.jsx` com todas as funcionalidades integradas:
```js
import {
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
  Button,
  TouchableOpacity,
  Platform,
} from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { categories } from "../../constants/categories";
import { colors } from "../../constants/colors";

export default function AddTransactions() {
  const initialForm = {
    description: "",
    value: 0,
    date: new Date(),
    category: "Renda",
  };

  const [form, setForm] = useState(initialForm);
  const [showPicker, setShowPicker] = useState(false);

  const addTransaction = () => {
    Alert.alert(
      `${form.description} | ${form.value} | ${form.date} | ${form.category}`
    );
  };

  const handleCurrencyChange = (text) => {
    const formattedValue = text.replace(/\D/g, "");
    const numberValue = formattedValue ? parseFloat(formattedValue) / 100 : 0;

    setForm({ ...form, value: numberValue });
  };

  const handleDateChange = (_, selectDate) => {
    setShowPicker(false);

    if (selectDate) {
      setForm({ ...form, date: selectDate });
    }
  };

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView style={globalStyles.content}>
        <View style={styles.form}>
          <View>
            <Text style={globalStyles.inputLabel}>Descrição</Text>
            <TextInput
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              style={globalStyles.input}
            />
          </View>

          <View>
            <Text style={globalStyles.inputLabel}>Valor</Text>
            <TextInput
              value={form.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
              onChangeText={handleCurrencyChange}
              keyboardType="numeric"
              style={globalStyles.input}
            />
          </View>

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

          <View>
            <Text style={globalStyles.inputLabel}>Categoria</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={form.category}
                onValueChange={(itemValue) =>
                  setForm({ ...form, category: itemValue })
                }
              >
                <Picker.Item
                  label={categories.income.displayName}
                  value={categories.income.name}
                />
                <Picker.Item
                  label={categories.food.displayName}
                  value={categories.food.name}
                />
                <Picker.Item
                  label={categories.house.displayName}
                  value={categories.house.name}
                />
                <Picker.Item
                  label={categories.education.displayName}
                  value={categories.education.name}
                />
                <Picker.Item
                  label={categories.travel.displayName}
                  value={categories.travel.name}
                />
              </Picker>
            </View>
          </View>
        </View>

        <Button title="Adicionar" onPress={addTransaction} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
    marginBottom: 40,
    marginTop: 10,
  },
  picker: {
    display: "flex",
    justifyContent: "center",
    height: 44,
    borderColor: colors.secondaryText,
    borderWidth: 1,
    borderRadius: 8,
    flexGrow: 1,
  },
});
```
✅ **O que alcançamos hoje?**
Nosso formulário agora é 100% à prova de falhas de digitação do usuário! Temos máscaras, seletores nativos de data perfeitamente configurados para iOS e Android, e um dropdown restritivo.

**Próximo Passo:** Na próxima aula, faremos um polimento final no formulário, resolvendo aquele problema chato do teclado do celular empurrando a Tab Bar (menu inferior) para cima enquanto digitamos!