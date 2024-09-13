import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import { useUserSelector } from "@/store/hooks";
import auth from "@react-native-firebase/auth";

const Profile = () => {
  const user = useUserSelector((state) => state.user);

  const handleAccountDeletion = async () => {
    try {
      Alert.alert(
        "Delete Account",
        "Are you sure you want to delete your account? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              const currentUser = auth().currentUser;

              if (currentUser) {
                await currentUser.delete();
                Alert.alert(
                  "Account deleted",
                  "Your account has been deleted successfully."
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Account deletion error: ", error);
      Alert.alert(
        "Error",
        "There was an issue deleting your account. Please try again later."
      );
    }
  };

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
      <Button
        onPress={handleAccountDeletion}
        mode="contained"
        style={styles.deleteButton}
        contentStyle={styles.buttonContent}
        color="red"
      >
        Delete Account
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
  deleteButton: {
    width: "100%",
    marginVertical: 10,
    backgroundColor: "red",
  },
  buttonContent: {
    height: 48,
  },
});

export default Profile;
