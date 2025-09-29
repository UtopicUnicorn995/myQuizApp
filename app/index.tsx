import { Link } from "expo-router";
import { Text, View, } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ paddingBottom: 40 }}>Edit app/index.tsx to edit this screen.</Text>
      <View style={{ gap: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Link href="/Game" style={{ color: 'red', fontSize: 28 }}>Game Screen</Link>
        <Link href="/Settings" style={{ color: 'red', fontSize: 28 }}>Settings details</Link>
      </View>
    </View>
  );
}
