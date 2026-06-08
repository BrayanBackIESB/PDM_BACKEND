import { useContext, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import SummaryItem from "../../components/SummaryItem";
import MonthYearFilter from "../../components/MonthYearFilter";
import PieChart from "../../components/PieChart";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

/**
 * Tela "Resumo".
 *
 * Mostra, para o período selecionado (filtro Mês/Ano):
 *  - um gráfico de pizza com a distribuição das despesas por categoria;
 *  - os totais por categoria;
 *  - o saldo final (receitas − despesas).
 *
 * @returns {JSX.Element}
 */
export default function Summary() {
  const { transactions, categories, loading } = useContext(MoneyContext);

  const { totalsById, balance, chartData } = useMemo(() => {
    const acc = {};
    let saldo = 0;

    for (const c of categories) acc[c.id] = 0;

    for (const t of transactions) {
      const numericValue = Number(t.value);
      if (acc[t.categoryId] !== undefined) {
        acc[t.categoryId] += numericValue;
      }
      const cat = t.category ?? categories.find((c) => c.id === t.categoryId);
      if (cat?.isIncome) {
        saldo += numericValue;
      } else {
        saldo -= numericValue;
      }
    }

    // Gráfico: apenas despesas (categorias que não são receita).
    const data = categories
      .filter((c) => !c.isIncome)
      .map((c) => ({
        label: c.displayName,
        value: acc[c.id] ?? 0,
        color: c.background,
      }));

    return { totalsById: acc, balance: saldo, chartData: data };
  }, [transactions, categories]);

  if (loading && categories.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const balanceStyle =
    balance >= 0 ? globalStyles.positiveText : globalStyles.negativeText;

  return (
    <View style={globalStyles.screenContainer}>
      <MonthYearFilter />
      <ScrollView style={globalStyles.content}>
        <Text style={styles.sectionTitle}>Despesas por categoria</Text>
        <PieChart data={chartData} />

        <View style={globalStyles.line} />
        <Text style={styles.sectionTitle}>Totais</Text>
        {categories.map((category) => (
          <SummaryItem
            key={category.id}
            category={category}
            value={totalsById[category.id] ?? 0}
          />
        ))}

        <View style={globalStyles.line} />
        <View style={styles.balance}>
          <Text style={styles.balanceText}>Saldo</Text>
          <Text style={balanceStyle}>
            {balance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryText,
    marginVertical: 8,
  },
  balance: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  balanceText: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: "800",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
