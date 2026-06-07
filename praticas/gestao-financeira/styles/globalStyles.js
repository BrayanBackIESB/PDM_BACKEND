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