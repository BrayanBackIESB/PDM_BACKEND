// contexts/GlobalState.jsx (essência)
import { createContext, useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export const MoneyContext = createContext();

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [cats, txs] = await Promise.all([
        api.listCategories(),
        api.listTransactions(),
      ]);
      setCategories(cats);
      setTransactions(txs);
    } catch (e) {
      setError(e.message ?? "Falha ao carregar dados do servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addTransaction = useCallback(async (data) => {
    // Chama a API para criar no banco de dados
    const newTx = await api.createTransaction(data);
    // Atualiza a lista na tela do aplicativo
    setTransactions((prev) => [...prev, newTx]);
  }, []);

  const removeTransaction = useCallback(async (id) => {
    // Chama a API para deletar no banco de dados
    await api.deleteTransaction(id);
    // Remove o item da lista na tela do aplicativo
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
    <MoneyContext.Provider value={{
      transactions, categories, loading, error, refresh,
      addTransaction, removeTransaction, addCategory, removeCategory,
    }}>
      {children}
    </MoneyContext.Provider>
  );
}