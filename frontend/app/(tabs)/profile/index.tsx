import { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { Avatar, SegmentedButtons } from "react-native-paper";
import Login from "../../../components/Login";
import Signup from "../../../components/Signup";
import Profile from "../../../components/Profile";
import {
  useTransactionSelector,
  useTransactionDispatch,
  useUserSelector,
} from "@/store/hooks";
import {
  fetchTransactionsFromCloud,
  syncTransactionsToCloud,
} from "@/store/transaction-actions";
import { transactionActions } from "@/store/transaction-slice";
import { useHeaderHeight } from "@react-navigation/elements";

const Index = () => {
  let headerHeight = useHeaderHeight();

  const [offlineUser, setOfflineUser] = useState(true);
  const [selectedForm, setSelectedForm] = useState("login");
  const transactions = useTransactionSelector(
    (state) => state.transaction.items
  );
  const user = useUserSelector((state) => state.user);
  const transactionDispatch = useTransactionDispatch();

  const isUserLoggedIn = user.loggedIn;

  useEffect(() => {
    const syncAndFetchTransactions = async () => {
      if (isUserLoggedIn && offlineUser) {
        await transactionDispatch(syncTransactionsToCloud(user, transactions));
        transactionDispatch(fetchTransactionsFromCloud(user));
        setOfflineUser(false);
      } else if (!offlineUser) {
        transactionDispatch(transactionActions.deleteTransactions());
        setOfflineUser(true);
      }
    };

    syncAndFetchTransactions();
  }, [user]);

  return (
    <ScrollView
      style={{ padding: 10 }}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="on-drag"
    >
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
