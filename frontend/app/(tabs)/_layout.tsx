import { useEffect, useState } from "react";
import { Avatar } from "react-native-paper";
import { Tabs } from "expo-router";
import { useUserDispatch } from "@/store/hooks";
import { userActions } from "@/store/user-slice";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export default function TabLayout() {
  const userDispatch = useUserDispatch();
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      const serializableUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        providerId: user.providerId,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        loggedIn: true,
      };
      userDispatch(userActions.setUser(serializableUser));
    } else {
      userDispatch(userActions.logout());
    }

    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <Tabs initialRouteName="poolPal">
      <Tabs.Screen
        name="poolPal"
        options={{
          title: "PoolPal",
          headerShown: false,
          tabBarIcon: () => (
            <Avatar.Icon
              icon={"home"}
              size={40}
              style={{ backgroundColor: "white", marginTop: 10 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          headerShown: false,
          tabBarIcon: () => (
            <Avatar.Icon
              icon={"cash"}
              size={40}
              style={{ backgroundColor: "white", marginTop: 10 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: () => (
            <Avatar.Icon
              icon={"account-circle"}
              size={40}
              style={{ backgroundColor: "white", marginTop: 10 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
