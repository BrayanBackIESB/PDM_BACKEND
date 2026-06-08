import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MoneyContext } from "../contexts/GlobalState";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const CURRENT_YEAR = new Date().getFullYear();
// Lista de anos: 5 anos para trás + 1 para frente.
const YEARS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - 5 + i);

/**
 * Filtro de período (Mês/Ano) compartilhado pelas telas de listagem e resumo.
 * Lê e atualiza o `filter` do MoneyContext, disparando o recarregamento.
 *
 * @returns {JSX.Element}
 */
export default function MonthYearFilter() {
  const { filter, setFilter } = useContext(MoneyContext);

  // 0 representa "Todos os meses".
  const monthValue = filter.month ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={globalStyles.inputLabel}>Mês</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={monthValue}
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, month: value === 0 ? null : value }))
            }
          >
            <Picker.Item label="Todos" value={0} />
            {MONTHS.map((label, index) => (
              <Picker.Item key={label} label={label} value={index + 1} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={globalStyles.inputLabel}>Ano</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={filter.year}
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, year: value }))
            }
          >
            {YEARS.map((year) => (
              <Picker.Item key={year} label={String(year)} value={year} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  field: {
    flex: 1,
  },
  picker: {
    justifyContent: "center",
    height: 44,
    borderColor: colors.secondaryText,
    borderWidth: 1,
    borderRadius: 8,
  },
});
