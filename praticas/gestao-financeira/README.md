# 💻 Aula 07: Tela de Resumo, Lógica de Totais e Otimização com `useMemo`

Na aba **Resumo**, o app agrega todas as transações: total por categoria e saldo final (positivo ou negativo). O foco é **performance**: um único loop O(n) e `useMemo` para não recalcular a cada render sem necessidade.

## 🎯 Objetivos da Aula

- Criar o componente `SummaryItem` para exibir o total de cada categoria.
- Implementar um algoritmo em uma passada sobre o array de transações (HashMap / acumuladores).
- Usar o hook `useMemo` para memoizar o resultado enquanto `transactions` não mudar.
- Exibir o saldo final com cores condicionais (verde / vermelho).
- Manter `CategoryItem` e o fluxo de totais **à prova de categorias inválidas** (AsyncStorage legado).

---

## 🔧 Revisão: `CategoryItem` (evitar crash na lista e no resumo)

A tela de resumo reutiliza `CategoryItem`. Se alguma transação antiga tiver `category` que não existe em `constants/categories.js`, acessar `categories[category].background` gera **`Cannot read property 'background' of undefined`**.

Garanta que `components/CategoryItem.jsx` use **fallback** e `StyleSheet.create` **estático** (sem recriar estilos a cada render):

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
 *   Se o valor não existir em `categories` (dados legados ou inválidos no AsyncStorage), usa
 *   `categories.food` como padrão para evitar crash ao acessar propriedades de `undefined`.
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

## 🧩 Passo 1: O componente `SummaryItem`

Componente enxuto: ícone da categoria, nome para exibição e valor total. O rótulo usa o mesmo fallback do `CategoryItem` (`categoryConfig`) para não quebrar com chaves desconhecidas.

Crie o arquivo `components/SummaryItem.jsx`:

```jsx
import { StyleSheet, Text, View } from "react-native";

import CategoryItem from "./CategoryItem";
import { categories } from "../constants/categories";
import { globalStyles } from "../styles/globalStyles";

/**
 * Linha de resumo: ícone da categoria, nome para exibição e valor total formatado.
 *
 * @param {Object} props - Propriedades do componente.
 * @param {string} props.category - Chave em `categories` (ex.: "food"). Valores desconhecidos
 *   usam o fallback de `categories.food` para o rótulo, alinhado ao `CategoryItem`.
 * @param {number} props.value - Total monetário da categoria (já agregado na tela de resumo).
 * @returns {JSX.Element} Container com ícone e textos.
 */
export default function SummaryItem({ category, value }) {
  const categoryConfig = categories[category] ?? categories.food;

  const valueStyle =
    category === categories.income.name
      ? globalStyles.positiveText
      : globalStyles.negativeText;

  return (
    <View style={styles.itemContainer}>
      <CategoryItem category={category} />
      <View style={styles.textContainer}>
        <Text style={globalStyles.primaryText}>
          {categoryConfig.displayName}
        </Text>
        <Text style={valueStyle}>
          {value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>
    </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 12,
  },
});
```

---

## 🧠 Passo 2: A tela de resumo e a lógica otimizada

Somar com vários `reduce` (um por categoria) repete trabalho. Aqui usamos **um único `for`**: acumulamos em um objeto `totals`. Transações com `category` fora da lista conhecida são **ignoradas**, evitando `NaN` e totais inconsistentes.

Abra o arquivo `app/(tabs)/summary.jsx`:

```jsx
import { useContext, useMemo } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import { categories } from "../../constants/categories";
import { globalStyles } from "../../styles/globalStyles";
import SummaryItem from "../../components/SummaryItem";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

/** Chaves de categoria válidas para acumular totais (exclui chaves auxiliares como `sum`). */
const SUMMARY_CATEGORY_KEYS = [
  categories.income.name,
  categories.food.name,
  categories.house.name,
  categories.education.name,
  categories.travel.name,
];

export default function Summary() {
  const [transactions] = useContext(MoneyContext);

  /**
   * Calcula totais por categoria e saldo geral em uma única passada O(n) sobre `transactions`.
   * Ignora itens cuja `category` não está em `SUMMARY_CATEGORY_KEYS` (dados legados/inválidos).
   *
   * @returns {{ sum: number, income: number, food: number, house: number, education: number, travel: number }}
   */
  const getTotals = () => {
    const totals = {
      sum: 0,
      income: 0,
      food: 0,
      education: 0,
      house: 0,
      travel: 0,
    };

    for (let i = 0; i < transactions.length; i++) {
      const item = transactions[i];
      if (!SUMMARY_CATEGORY_KEYS.includes(item.category)) {
        continue;
      }

      totals[item.category] += item.value;

      if (item.category === categories.income.name) {
        totals.sum += item.value;
      } else {
        totals.sum -= item.value;
      }
    }
    return totals;
  };

  /* useMemo: recalcula só quando [transactions] mudar. */
  const totals = useMemo(getTotals, [transactions]);

  const valueStyle =
    totals.sum > 0 ? globalStyles.positiveText : globalStyles.negativeText;

  return (
    <View style={globalStyles.screenContainer}>
      <View style={globalStyles.content}>
        <SummaryItem
          category={categories.income.name}
          value={totals[categories.income.name]}
        />
        <SummaryItem
          category={categories.food.name}
          value={totals[categories.food.name]}
        />
        <SummaryItem
          category={categories.house.name}
          value={totals[categories.house.name]}
        />
        <SummaryItem
          category={categories.education.name}
          value={totals[categories.education.name]}
        />
        <SummaryItem
          category={categories.travel.name}
          value={totals[categories.travel.name]}
        />

        <View style={globalStyles.line} />

        <View style={styles.balance}>
          <Text style={styles.balanceText}>Saldo</Text>
          <Text style={valueStyle}>
            {totals.sum.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balance: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceText: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: 800,
  },
});
```

**Nota sobre imports:** em `app/(tabs)/index.jsx` o projeto usa o alias `@/contexts/GlobalState`. Em `summary.jsx` desta branch o import relativo `../../contexts/GlobalState` é o que está no repositório; ambos funcionam se o alias estiver configurado no Babel/Expo.

---

## 💡 Debug (AsyncStorage)

Se ainda houver dados corrompidos, você pode limpar o storage uma vez com `AsyncStorage.clear()` temporário em `contexts/GlobalState.jsx` (rodar o app e remover depois). Com `CategoryItem`, `SummaryItem` e o filtro em `getTotals`, categorias inválidas deixam de derrubar a UI e não poluem o saldo com `NaN`.

---

## 🚀 Desafio final: portfólio

1. **Filtro de mês/ano** nas telas de lista e resumo.
2. **Gráficos** (ex.: pizza) na aba de resumo.
3. **Edição e exclusão** de transações (toque longo, modal).
4. **Categorias customizadas** além das cinco fixas.

---

## ✅ O que alcançamos

App com lista, persistência, resumo por categoria, saldo final, `useMemo` e camadas defensivas para dados legados.

**Próximo passo (bônus):** preparar build / `.apk` para instalação no dispositivo.
