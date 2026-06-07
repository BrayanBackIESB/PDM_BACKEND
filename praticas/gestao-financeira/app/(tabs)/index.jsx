import { MoneyContext } from "@/contexts/GlobalState"
import { useContext } from "react"
import { Text } from "react-native"

export default function Transactions() {
  const [transactions] = useContext(MoneyContext)

  return <Text>{transactions[0]?.description}</Text>
}