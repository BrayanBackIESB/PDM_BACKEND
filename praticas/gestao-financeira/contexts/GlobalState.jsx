// contexts/GlobalState.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/api";
import { AuthContext } from "./AuthContext";

export const MoneyContext = createContext();

const now = new Date();

export default function GlobalState({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtro de período. `month` null = todos os meses do ano selecionado.
  const [filter, setFilter] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const [cats, txs] = await Promise.all([
        api.listCategories(),
        api.listTransactions(filter),
      ]);
      setCategories(cats);
      setTransactions(txs);
    } catch (e) {
      setError(e.message ?? "Falha ao carregar dados do servidor");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filter]);

  // Recarrega ao autenticar e sempre que o filtro mudar.
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    } else {
      setTransactions([]);
      setCategories([]);
      setLoading(false);
    }
  }, [isAuthenticated, refresh]);

  const addTransaction = useCallback(async (data) => {
    const newTx = await api.createTransaction(data);
    setTransactions((prev) => [newTx, ...prev]);
  }, []);

  const updateTransaction = useCallback(async (id, data) => {
    const updated = await api.updateTransaction(id, data);
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? updated : tx))
    );
    return updated;
  }, []);

  const removeTransaction = useCallback(async (id) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const addCategory = useCallback(async (data) => {
    const newCat = await api.createCategory(data);
    setCategories((prev) => [...prev, newCat]);
  }, []);

  const removeCategory = useCallback(async (id) => {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  }, []);

  return (
    <MoneyContext.Provider
      value={{
        transactions,
        categories,
        loading,
        error,
        filter,
        setFilter,
        refresh,
        addTransaction,
        updateTransaction,
        removeTransaction,
        addCategory,
        removeCategory,
      }}
    >
      {children}
    </MoneyContext.Provider>
  );
}
