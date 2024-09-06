import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Formik } from "formik";
import auth, { firebase } from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import {
  AppleButton,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

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

  async function onAppleButtonPress() {
    // 1). start a apple sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // 2). if the request was successful, extract the token and nonce
    const { identityToken, nonce } = appleAuthRequestResponse;

    // can be null in some scenarios
    if (identityToken) {
      // 3). create a Firebase `AppleAuthProvider` credential
      const appleCredential = firebase.auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      );

      // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
      //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
      //     to link the account to an existing user
      const userCredential = await firebase
        .auth()
        .signInWithCredential(appleCredential);
    } else {
      // handle this - retry?
    }
  }

  GoogleSignin.configure({
    webClientId:
      "423846543027-92h9ktnme24mnk7jauakk7v2f1rqam2t.apps.googleusercontent.com",
  });

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token

    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken!);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  return (
    <>
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

      <View>
        <AppleButton
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          style={{
            width: "100%",
            height: 45,
          }}
          onPress={() => onAppleButtonPress()}
        />
      </View>

      <GoogleSigninButton
        style={{
          width: "100%",
          height: 45,
        }}
        onPress={() => onGoogleButtonPress()}
      />
    </>
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
