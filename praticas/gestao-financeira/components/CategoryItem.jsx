import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { categories } from "../constants/categories";
import { colors } from "../constants/colors";

export default function CategoryItem({ category }) {
  return (
    <View style={styles({ category }).background}>
      <MaterialIcons
        name={categories[category].icon}
        size={24}
        color={colors.primaryContrast}
      />
    </View>
  );
}

const styles = ({ category }) =>
  StyleSheet.create({
    background: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: categories[category].background,
    },
  });
