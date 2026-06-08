import { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MoneyContext } from "../contexts/GlobalState";
import { colors } from "../constants/colors";
import Button from "./Button";
import DescriptionInput from "./DescriptionInput";
import CurrencyInput from "./CurrencyInput";
import DatePicker from "./DatePicker";
import CategoryPicker from "./CategoryPicker";

/**
 * Modal de edição/exclusão de transação (aberto por long-press na lista).
 *
 * @param {{
 *   visible: boolean,
 *   transaction: object|null,
 *   onClose: () => void
 * }} props
 * @returns {JSX.Element|null}
 */
export default function EditTransactionModal({ visible, transaction, onClose }) {
  const { categories, updateTransaction, removeTransaction } =
    useContext(MoneyContext);
  const valueInputRef = useRef();

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        value: Number(transaction.value),
        date: new Date(transaction.date),
        categoryId: transaction.categoryId,
      });
    }
  }, [transaction]);

  if (!transaction || !form) return null;

  const handleSave = async () => {
    if (!form.description.trim()) {
      return Alert.alert("Informe a descrição.");
    }
    if (!form.value || form.value <= 0) {
      return Alert.alert("Informe um valor maior que zero.");
    }
    if (!form.categoryId) {
      return Alert.alert("Selecione uma categoria.");
    }

    setSaving(true);
    try {
      await updateTransaction(transaction.id, {
        description: form.description.trim(),
        value: form.value,
        date: form.date,
        categoryId: form.categoryId,
      });
      onClose();
    } catch (e) {
      Alert.alert("Erro ao salvar", e.message ?? "Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir transação",
      `Deseja excluir "${transaction.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await removeTransaction(transaction.id);
              onClose();
            } catch (e) {
              Alert.alert("Erro ao excluir", e.message ?? "Tente novamente.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar transação</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.form}>
            <DescriptionInput
              form={form}
              setForm={setForm}
              valueInputRef={valueInputRef}
            />
            <CurrencyInput
              form={form}
              setForm={setForm}
              valueInputRef={valueInputRef}
            />
            <DatePicker form={form} setForm={setForm} />
            <CategoryPicker
              form={form}
              setForm={setForm}
              categories={categories}
            />

            <View style={styles.actions}>
              <Button onPress={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>

              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={20}
                  color={colors.negativeText}
                />
                <Text style={styles.deleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primaryText,
  },
  form: {
    gap: 12,
    paddingBottom: 12,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  deleteText: {
    color: colors.negativeText,
    fontWeight: "700",
    fontSize: 16,
  },
});
