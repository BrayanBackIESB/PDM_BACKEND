# 💻 Aula 01: Criação do Projeto, Setup Inicial e Navegação por Abas (Tab Navigation)

Chegou a hora de colocar a mão na massa! Nesta primeira etapa de desenvolvimento do app **Money** (Gestão Financeira), vamos criar o projeto do zero, limpar o código padrão gerado pelo Expo e configurar a base do nosso aplicativo: a navegação entre as três telas principais usando uma Tab Bar personalizada.

## 🎯 Objetivos da Aula
* Criar um projeto React Native usando o template padrão do Expo.
* Rodar o aplicativo no emulador/celular.
* Limpar arquivos e componentes desnecessários do projeto padrão.
* Criar a estrutura inicial das 3 telas principais: `Transactions`, `AddTransaction` e `Summary`.
* Configurar o `Tabs` do Expo Router para criar a barra de navegação inferior.
* Personalizar a Tab Bar (cores, ícones e um botão central estilizado).

## 🚀 Passo 0: Criando e Rodando o Projeto
Antes de limparmos a casa, precisamos construí-la. Abra o seu terminal (ou o terminal integrado do VS Code) na pasta onde deseja salvar o projeto e execute o comando de criação do Expo:

```bash
npx create-expo-app
```
O terminal fará algumas perguntas. Quando ele perguntar o nome do aplicativo (`What is your app named?`), digite: **gestao-financeira**.

Aguarde a instalação dos pacotes (isso pode levar cerca de um minuto). Assim que aparecer a mensagem `✅ Your project is ready!`, preste muita atenção neste detalhe clássico que costuma gerar o erro `ENOENT`:

- ⚠️ **Atenção:** Você não pode rodar o projeto de fora da pasta dele! Se você tentar rodar `npm run android` agora, o terminal não encontrará o arquivo `package.json`. Você deve entrar na pasta do projeto primeiro!

Execute os comandos abaixo na sequência:
```bash
# 1. Entre na pasta do projeto
cd gestao-financeira

# 2. Inicie o servidor do Expo para Android (ou use npm start para abrir o menu geral)
npm run android
```

Se a porta 8081 já estiver em uso, o Expo perguntará se você deseja usar a porta 8082. Basta digitar `yes` (y). O Expo irá gerar um **QR Code** no terminal. Escaneie-o com o aplicativo Expo Go no seu celular (Android) ou Câmera (iOS) para ver o app rodando!

## 🧹 Passo 1: Limpeza do Projeto
Quando criamos um projeto, ele vem com vários arquivos de exemplo. Vamos fazer uma faxina:
1. Delete os arquivos desnecessários das pastas `assets/images`, `components` e `constants`.
2. No arquivo `app/(tabs)/_layout.tsx`, apague todo o conteúdo e deixe retornando apenas uma `<View>` temporária.
3. Altere as extensões dos arquivos de rotas de `.tsx` para `.jsx` (já que estamos usando JavaScript padrão e não TypeScript).

## 📄 Passo 2: Criando as Telas Base
Dentro da pasta `app/(tabs)`, vamos garantir que temos os 3 arquivos principais que representarão nossas abas:

- `index.jsx` (Tela inicial - Lista de transações)
- `add-transactions.jsx` (Tela de formulário)
- `summary.jsx` (Tela de resumo)

*Exemplo da estrutura básica de cada tela:*

```js
import { Text } from 'react-native';

export default function Transactions() {
  return <Text>Transações</Text>;
}
```
## 🧭 Passo 3: Configurando o TabsLayout
No arquivo de layout das abas (`_layout.jsx`), vamos configurar o componente `<Tabs>` do expo-router e definir as telas:

```js
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="AddTransactions" />
      <Tabs.Screen name="summary" />
    </Tabs>
  );
}
```
*Não se esqueça de registrar esse grupo de abas no layout principal (`app/_layout.jsx`) dentro de um `<Stack>`.*

## 🎨 Passo 4: Estilizando o Cabeçalho e a Status Bar
Vamos deixar o app com a identidade visual do Figma.

1. **Cores Centralizadas:** Crie um arquivo `colors.js` (ou use o fornecido no repositório) para armazenar os códigos hexadecimais (ex: verde primário, cinza inativo).
2. **Status Bar:** No `app/_layout.jsx`, adicione o componente `<StatusBar>` e defina o `style="light"` e o `backgroundColor` primário.
3. **Header (Cabeçalho):** No `TabsLayout`, use a propriedade `screenOptions` para pintar o fundo do cabeçalho de verde, deixar o texto branco e centralizá-lo (`headerTitleAlign: 'center'`).

## 🔘 Passo 5: A Tab Bar Personalizada
O grande charme dessa interface é o botão central flutuante. Em vez de um ícone comum, a aba do meio ("Adicionar") será um grande círculo verde com um sinal de "mais".

**Como fazer isso nas `options` da aba `AddTransactions`:**
1. Esconda o nome da aba usando `tabBarLabel`: ''.
2. No `tabBarIcon`, retorne uma `<View>` estilizada como um círculo (usando `width`, `height`, `borderRadius` e `backgroundColor`).
3. Dentro dessa View, coloque o ícone do `MaterialIcons` (nome `add`) com a cor branca.
4. Para evitar que o botão fique cortado, aumente a altura total da barra através do `tabBarStyle` global.

*Dica Extra:* Para um visual mais limpo, você pode trocar o botão padrão da aba por um `<TouchableOpacity>` usando a propriedade `tabBarButton`, ajustando o `activeOpacity` para remover aquele fundo cinza indesejado ao clicar.

✅ **O que alcançamos hoje?**
Seu aplicativo agora foi devidamente inicializado, possui três telas roteadas, um cabeçalho verde alinhado e uma barra inferior personalizada com um botão de ação centralizado e esteticamente agradável.

**Próximo Passo:** No próximo commit, daremos vida à tela do meio, construindo o **Formulário de Adicionar Transação!**

## 💻 Código Fonte da Aula
Abaixo estão os códigos desenvolvidos durante esta aula, organizados por arquivo.

**constants/colors.js**

```js
export const colors = {
  primary: "#37BF81",
  primaryContrast: "#FFFFFF",
  inactive: "#B1B1B1",
  background: "#F5F5F5",
  categoryIncome: "#DE9AC3",
  categoryFood: "#DEA17B",
  categoryHouse: "#E6E088",
  categoryEducation: "#AB8FBE",
  categoryTravel: "#82C9DE",
  primaryText: "#666666",
  secondaryText: "#B1B1B1",
  positiveText: "#37BF81",
  negativesText: "#DA5567"
}
```
**app/_layout.jsx**
```js
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { colors } from "../constants/colors"

export default function RootLayout() {
  return (
    <>
      <StatusBar backgroundColor={colors.primary} style="light"/>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  )
}
```
**app/(tabs)/_layout.jsx**
```js
import { Tabs } from "expo-router"
import { colors } from "../../constants/colors"
import { MaterialIcons } from "@expo/vector-icons"
import { StyleSheet, TouchableOpacity, View } from "react-native"

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.primaryContrast,
        headerTitleAlign: "center",
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
            height: 60,
            paddingTop: 5,
            backgroundColor: colors.background
        },
        tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={0.8}/>
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Transações",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="attach-money" size={28} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="add-transactions"
        options={{
          title: "Adicionar Transação",
          tabBarLabel: "",
          tabBarIcon: () => (
            <View style={styles.addButton}>
              <MaterialIcons name="add" size={40} color={colors.primaryContrast} />
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: "Resumo",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="pie-chart" size={28} color={color} />
          )
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  addButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: colors.primary
  }
})

```
**app/(tabs)/index.jsx**
```js
import { Text } from "react-native"

export default function Transactions() {
  return <Text>Transações</Text>
}
```
**app/(tabs)/add-transactions.jsx**
```js
import { Text } from "react-native"

export default function AddTransactions() {
  return <Text>Adicionar Transações</Text>
}
```
**app/(tabs)/summary.jsx**
```js
import { Text } from "react-native"

export default function Summary() {
  return <Text>Resumo</Text>
}
```
**app/+not-found.jsx**
```jsx
import { Text } from "react-native"

export default function NotFoundScreen() {
  return <Text>Not found</Text>
}
```

