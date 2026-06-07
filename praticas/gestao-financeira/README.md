# 💻 Aula 02: Layout e Estado do Formulário (Adicionar Transações)

Dando continuidade ao nosso aplicativo **Money**, nesta aula vamos focar na aba do meio: a tela de **Adicionar Transações**. O objetivo aqui é desenhar a interface, criar inputs para os dados e conectar tudo isso a um estado (`useState`) inteligente para gerenciar o formulário.

## 🎯 Objetivos da Aula
* Adicionar o ícone do aplicativo no `app.json`.
* Criar a estrutura base da tela de Adicionar Transações (Inputs e Botão).
* Criar um arquivo de estilos globais (`GlobalStyles.js`) para reaproveitamento de código.
* Componentizar o botão principal da aplicação.
* Gerenciar o estado de múltiplos inputs usando um único `useState` contendo um objeto.

## 📱 Passo 1: Configurando o Ícone do App
Antes de codar a tela, vamos deixar nosso app com cara de app profissional! 
Abra o arquivo `app.json` (na raiz do projeto) e localize as configurações de ícone e splash screen. Substitua os caminhos pelas imagens que você disponibilizou na pasta de `assets`:

```json
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png"
    }
  }
}
```
*Atenção: Para que o ícone atualize no Expo Go, geralmente é necessário parar o servidor no terminal (`Ctrl+C`) e rodar novamente (`npm run android`).*

## 🏗️ Passo 2: Estrutura Base e Estilos Globais
Na tela `add-transactions.jsx`, vamos precisar de quatro campos: Descrição, Valor, Data e Categoria. Para que as telas fiquem padronizadas, vamos criar uma pasta `styles/` na raiz e dentro dela o arquivo `globalStyles.js`.

Criando o `globalStyles.js`:
```js
import { StyleSheet } from "react-native"
import { colors } from "../constants/colors"

export const globalStyles = StyleSheet.create({
  screenContainer: {
    display: "flex",
    flex: 1
  },
  content: {
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 20
  },
  input: {
    height: 40,
    paddingHorizontal: 16,
    borderColor: colors.secondaryText,
    borderWidth: 1,
    borderRadius: 8,
    flexGrow: 1
  },
  inputLabel: {
    fontSize: 16,
    color: colors.primaryText,
    marginBottom: 4
  }
})
```
**Por que usar `padding` na ScrollView?**
Ao invés de usar `margin`, usamos `paddingHorizontal` na nossa `<ScrollView>`. Se usássemos margem, a barra de rolagem visual do celular ficaria "descolada" da borda da tela. O `padding` garante que o conteúdo afaste, mas a barra de rolagem continue encostada no canto!

## 🔘 Passo 3: Componentizando o Botão
Em vez de criar um botão do zero em cada tela, vamos criar um componente reutilizável.
Crie o arquivo `components/Button.jsx`:

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
    fontWeight: 600,
  },
});

```
## 🧠 Passo 4: O Estado Centralizado (O pulo do gato!)
Geralmente, criamos um `useState` para cada input (`const [descricao, setDescricao] = useState('')`). Mas como temos 4 campos, isso pode ficar confuso. Vamos aprender uma técnica avançada: um único estado com um objeto dentro!

No arquivo `add-transactions.jsx`:

```jsx
import {
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
  Button,
} from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { useState } from "react";
export default function AddTransactions() {
  const initialForm = {
    description: "",
    value: 0,
    date: "",
    category: "Renda",
  };
   // Estado inicial como um objeto
  const [form, setForm] = useState(initialForm);

  const addTransaction = () => {
    Alert.alert(
      `${form.description} | ${form.value} | ${form.date} | ${form.category}`,
    );
  };

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView style={globalStyles.content}>
        <View style={StyleSheet.form}>
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
              value={form.value}
              onChangeText={(text) => setForm({ ...form, value: text })}
              keyboardType="numeric"
              style={globalStyles.input}
            />
          </View>

          <View>
            <Text style={globalStyles.inputLabel}>Data</Text>
            <TextInput
              value={form.date}
              onChangeText={(text) => setForm({ ...form, date: text })}
              style={globalStyles.input}
            />
          </View>

          <View>
            <Text style={globalStyles.inputLabel}>Categoria</Text>
            <TextInput
              value={form.category}
              onChangeText={(text) => setForm({ ...form, category: text })}
              style={globalStyles.input}
            />
          </View>
        </View>

        <Button title="Adicionar" onPress={addTransaction} />
      </ScrollView>
    </View>
  );
}

```
✅ **O que alcançamos hoje?**
Nossa tela de adição já tem cara de formulário real! Aprendemos a criar estilos globais para padronizar o app, criamos um botão customizado e, o mais importante, aprendemos a gerenciar um formulário inteiro usando um único estado do React.

**Próximo Passo:** Por enquanto, Data e Categoria são apenas campos de texto normais. Na próxima aula, vamos evoluir isso introduzindo um **DatePicker** e um **Dropdown** de verdade!