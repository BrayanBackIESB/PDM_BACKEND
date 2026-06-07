import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useEffect, useState } from "react"

export const MoneyContext = createContext()

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    // AsyncStorage.clear()
    const getAsyncStorage = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem("transactions")
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions))
        }
      } catch (e) {
        console.log(e)
      }
    }
    getAsyncStorage()
  }, [])

  return (
    <MoneyContext.Provider value={[transactions, setTransactions]}>
      {children}
    </MoneyContext.Provider>
  )
}