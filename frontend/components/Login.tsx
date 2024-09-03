import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Formik } from "formik";
import auth from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: any) => {
    const { email, password } = values;
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Sign in failed: " + err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={(values) => handleLogin(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.container}>
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
            Login
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

export default Login;
