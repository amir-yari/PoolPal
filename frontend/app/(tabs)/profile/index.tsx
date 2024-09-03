import { useState } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { Avatar, SegmentedButtons } from "react-native-paper";
import Login from "../../../components/Login";
import Signup from "../../../components/Signup";
import Profile from "../../../components/Profile";
import { useUserSelector } from "@/store/hooks";

const Index = () => {
  const [selectedForm, setSelectedForm] = useState("login");
  const user = useUserSelector((state) => state.user);

  const isUserLoggedIn = user && Object.keys(user).length > 0 && user.uid;

  return (
    <ScrollView style={styles.container}>
      <Avatar.Icon icon={"account"} size={100} style={styles.avatar} />
      {isUserLoggedIn ? (
        <Profile />
      ) : (
        <>
          <SegmentedButtons
            value={selectedForm}
            onValueChange={setSelectedForm}
            buttons={[
              { value: "login", label: "Login" },
              { value: "signup", label: "Signup" },
            ]}
            style={styles.segmentedButtons}
          />
          <Text style={styles.infoText}>
            Save your transactions to your profile, and use PoolPal on multiple
            devices.
          </Text>
          {selectedForm === "login" ? <Login /> : <Signup />}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  avatar: {
    backgroundColor: "white",
    alignSelf: "center",
  },
  segmentedButtons: {
    marginVertical: 20,
    marginHorizontal: 16,
  },
  infoText: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default Index;
