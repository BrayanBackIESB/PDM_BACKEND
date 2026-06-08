import { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import { AuthContext } from "../../contexts/AuthContext";
import TransactionItem from "../../components/TransactionItem";
import MonthYearFilter from "../../components/MonthYearFilter";
import EditTransactionModal from "../../components/EditTransactionModal";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

/**
 * Tela "Transações".
 *
 * Lista as transações do período selecionado (filtro Mês/Ano), com:
 *  - saudação com o nome do usuário autenticado,
 *  - estado de carregamento inicial,
 *  - mensagem de erro com botão de "Tentar novamente",
 *  - pull-to-refresh,
 *  - long-press abrindo um Modal para editar/excluir.
 *
 * @returns {JSX.Element}
 */
export default function Transactions() {
  const { transactions, loading, error, refresh } = useContext(MoneyContext);
  const { user } = useContext(AuthContext);

  const [selected, setSelected] = useState(null);

  const header = (
    <View>
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>
          Olá, {user?.name ?? "bem-vindo"}!
        </Text>
        <Text style={globalStyles.secondaryText}>
          Aqui estão suas transações do período.
        </Text>
      </View>
      <MonthYearFilter />
    </View>
  );

  if (loading && transactions.length === 0) {
    return (
      <View style={globalStyles.screenContainer}>
        {header}
        <View style={[styles.center, { flex: 1 }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={globalStyles.secondaryText}>
            Carregando transações...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.screenContainer}>
        {header}
        <View style={[styles.center, { flex: 1 }]}>
          <Text style={globalStyles.primaryText}>
            Não foi possível carregar.
          </Text>
          <Text style={globalStyles.secondaryText}>{error}</Text>
          <TouchableOpacity onPress={refresh} style={styles.retry}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => setSelected(item)}
            activeOpacity={0.7}
          >
            <TransactionItem {...item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[globalStyles.secondaryText, styles.empty]}>
            Nenhuma transação neste período. Toque e segure um item para editar,
            ou adicione na aba do meio.
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={styles.listContent}
      />

      <EditTransactionModal
        visible={!!selected}
        transaction={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  welcome: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 2,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
  },
  empty: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  retry: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.primaryContrast,
    fontWeight: "600",
  },
});
