import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useUserSelector } from "@/store/hooks";
import auth from "@react-native-firebase/auth";

const Profile = () => {
  const user = useUserSelector((state) => state.user);
  console.log(user);

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>
        {user?.displayName || "PoolPal Participant"}
      </Text>
      <Button
        onPress={() => auth().signOut()}
        mode="contained"
        style={styles.logoutButton}
        contentStyle={styles.buttonContent}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  logoutButton: {
    width: "100%",
    marginVertical: 10,
  },
  buttonContent: {
    height: 48,
  },
});

export default Profile;
