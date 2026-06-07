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
