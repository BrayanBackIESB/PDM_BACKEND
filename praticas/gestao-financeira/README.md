# 💻 Aula 06: Listagem de Transações (FlatList e Estilização Dinâmica)

Até agora, o aplicativo salva as transações de forma persistente (AsyncStorage). Nesta aula, damos vida à aba principal: uma lista para exibir as movimentações. Veremos como formatar dados na tela, estilos condicionais (renda em verde, gastos em vermelho) e o uso de `ListEmptyComponent` na `FlatList`.

## 🎯 Objetivos da Aula

- Utilizar o componente `<FlatList>` para renderizar listas otimizadas.
- Criar um componente isolado para o item da lista (`TransactionItem`).
- Criar um componente de ícone por categoria (`CategoryItem`), com estilo dinâmico e proteção contra categorias inválidas.
- Aplicar estilização condicional (cores diferentes conforme o tipo de transação).
- Formatar datas e valores monetários para o padrão brasileiro (`pt-BR`).
- Usar a propriedade `ListEmptyComponent` da `FlatList`.

---

## 🎨 Passo 1: Atualizando os Estilos Globais

Antes dos componentes, inclua no `StyleSheet.create` de `styles/globalStyles.js` as classes de linha e de textos primário, secundário, positivo e negativo (o vermelho usa a chave `negativesText` em `constants/colors.js`):

```javascript
// Trecho a adicionar ao StyleSheet.create em globalStyles.js
line: {
  backgroundColor: colors.secondaryText,
  height: 1,
  opacity: 0.5,
  marginBottom: 4,
},
primaryText: {
  fontSize: 16,
  color: colors.primaryText,
},
secondaryText: {
  fontSize: 12,
  color: colors.secondaryText,
},
positiveText: {
  fontSize: 16,
  color: colors.positiveText,
},
negativeText: {
  fontSize: 16,
  color: colors.negativesText,
},
```

---

## 🔣 Passo 2: O ícone dinâmico (`CategoryItem`)

Cada transação exibe um ícone circular à esquerda. A cor de fundo e o glifo vêm de `constants/categories.js`. Como transações antigas no AsyncStorage podem trazer uma `category` que não existe mais nas chaves do objeto `categories`, o componente usa **fallback** (`?? categories.food`) para não acessar propriedades de `undefined` e evitar crash.

Crie o arquivo `components/CategoryItem.jsx`:

```jsx
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { categories } from "../constants/categories";
import { colors } from "../constants/colors";

/**
 * Exibe o ícone da categoria em um círculo com a cor de fundo correspondente.
 *
 * @param {Object} props - Propriedades do componente.
 * @param {string} props.category - Chave da categoria em `categories` (ex.: "food", "income").
 *   Se o valor não existir em `categories` (dados legados ou inválidos), usa "food" como padrão
 *   para evitar crash ao acessar propriedades de `undefined`.
 * @returns {JSX.Element} View com ícone Material centrado.
 */
export default function CategoryItem({ category }) {
  const categoryConfig = categories[category] ?? categories.food;

  return (
    <View
      style={[styles.background, { backgroundColor: categoryConfig.background }]}
    >
      <MaterialIcons
        name={categoryConfig.icon}
        size={24}
        color={colors.primaryContrast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});
```

---

## 💳 Passo 3: O item da transação (`TransactionItem`)

Monte a linha completa: ícone, data, descrição e valor. A cor do valor (`valueStyle`) depende de a categoria ser renda (`categories.income.name`) ou não.

Crie o arquivo `components/TransactionItem.jsx`:

```jsx
import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import CategoryItem from "./CategoryItem";
import { categories } from "../constants/categories";

export default function TransactionItem({
  category,
  date,
  description,
  value,
}) {
  const valueStyle =
    category === categories.income.name
      ? globalStyles.positiveText
      : globalStyles.negativeText;

  return (
    <>
      <View style={styles.itemContainer}>
        <CategoryItem category={category} />
        <View style={styles.textContainer}>
          <Text style={globalStyles.secondaryText}>
            {new Date(date).toLocaleDateString("pt-BR")}
          </Text>
          <View style={styles.bottomLineContainer}>
            <Text style={globalStyles.primaryText}>{description}</Text>
            <Text style={valueStyle}>
              {value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
        </View>
      </View>
      <View style={globalStyles.line} />
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
  },
  textContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
    paddingVertical: 8,
  },
  bottomLineContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
```

---

## 📋 Passo 4: A tela principal com `FlatList`

Em `app/(tabs)/index.jsx`, leia `transactions` do `MoneyContext` e passe cada item para `TransactionItem`. O projeto usa o alias `@` (veja `babel.config.js` / `tsconfig`): o import do contexto fica `@/contexts/GlobalState`.

**Por que a `FlatList` ajuda?** Entre outras coisas, `ListEmptyComponent` exibe uma mensagem quando ainda não há transações (por exemplo, logo após instalar o app).

```jsx
import { MoneyContext } from "@/contexts/GlobalState";
import { useContext } from "react";
import { FlatList, Text, View } from "react-native";
import TransactionItem from "../../components/TransactionItem";
import { globalStyles } from "../../styles/globalStyles";

export default function Transactions() {
  const [transactions] = useContext(MoneyContext);

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem {...item} />}
        ListEmptyComponent={
          <Text style={globalStyles.secondaryText}>
            Ainda não há nenhum item!
          </Text>
        }
        style={globalStyles.content}
      />
    </View>
  );
}
```

Se o React Native avisar sobre falta de `key` estável, você pode acrescentar `keyExtractor={(item) => String(item.id)}` (desde que cada transação tenha `id` único, como em `add-transactions`).

---

## 💡 Dica de debug (AsyncStorage)

Se dados antigos estiverem inconsistentes (formato de data estranho, campos faltando) e a lista quebrar ao carregar, limpe o storage temporariamente: em `contexts/GlobalState.jsx`, dentro do `useEffect` que lê o AsyncStorage, chame `AsyncStorage.clear()` uma vez, execute o app, depois remova essa linha.

Com o `CategoryItem` atual, categorias desconhecidas deixam de derrubar o app (caem no fallback), mas outros problemas de payload ainda podem exigir limpar ou corrigir os dados salvos.

---

## ✅ O que alcançamos

A aba principal lista transações com boa performance, moeda e data em `pt-BR`, cores condicionais para renda e despesa, estado vazio amigável e ícones por categoria resilientes a dados legados.

**Próximo passo:** na última grande aula, a **aba de resumo**, agrupando valores para estatísticas.
