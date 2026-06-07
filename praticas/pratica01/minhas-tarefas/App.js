import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { titulo } from "./utils";
import titulo_default from "./utils";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={{ margin: 30, fontSize: 16 }}>{titulo_default}</Text>
      <Button title="Clique aqui" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    margin: 20,
    fontSize: 20,
    color: "#2d07eeff",
  },
});
