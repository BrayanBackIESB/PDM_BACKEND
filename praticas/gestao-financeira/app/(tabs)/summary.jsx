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
