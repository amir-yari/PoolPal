import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Formik } from "formik";
import auth from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter } from "expo-router";
import { useUserDispatch } from "@/store/hooks";
import { userActions } from "@/store/user-slice";

const Signup = () => {
  const userDispatch = useUserDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values: any) => {
    const { fname, lname, email, password } = values;
    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        await user.updateProfile({
          displayName: `${fname} ${lname}`,
        });
      }
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
        userDispatch(userActions.setUser(null!));
      }
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        fname: "",
        lname: "",
        email: "",
        password: "",
      }}
      onSubmit={(values) => handleSignup(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.container}>
          <TextInput
            onChangeText={handleChange("fname")}
            onBlur={handleBlur("fname")}
            value={values.fname}
            placeholder="First name"
            label="First name"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            onChangeText={handleChange("lname")}
            onBlur={handleBlur("lname")}
            value={values.lname}
            placeholder="Last name"
            label="Last name"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            placeholder="Email"
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            placeholder="Password"
            label="Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <Button
            onPress={() => handleSubmit()}
            mode="contained"
            loading={loading}
          >
            Signup
          </Button>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default Signup;
