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
  statusCodes,
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
    try {
      // 1). Start an Apple sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // 2). If the request was successful, extract the token and nonce
      const { identityToken, nonce } = appleAuthRequestResponse;

      // Check if the identityToken is null or undefined
      if (identityToken) {
        // 3). Create a Firebase `AppleAuthProvider` credential
        const appleCredential = firebase.auth.AppleAuthProvider.credential(
          identityToken,
          nonce
        );

        // 4). Use the created `AppleAuthProvider` credential to sign in with Firebase
        const userCredential = await firebase
          .auth()
          .signInWithCredential(appleCredential);
        return userCredential; // Return the user credentials if needed
      } else {
        throw new Error("Apple sign-in failed: No identity token returned.");
      }
    } catch (error: unknown) {
      // Type narrowing for the 'error' object
      if (error instanceof Error) {
        console.error("Apple sign-in error: ", error.message);
      }

      // Handling Apple-specific error codes (pseudo error codes for demonstration purposes)
      if (typeof error === "object" && error !== null && "code" in error) {
        const errorCode = (error as { code: string }).code;

        switch (errorCode) {
          case "apple_sign_in_cancelled":
            console.log("Apple sign-in was cancelled by the user.");
            break;
          case "apple_sign_in_in_progress":
            console.log("Apple sign-in is already in progress.");
            break;
          case "apple_sign_in_failed":
            console.log("Apple sign-in failed. Please try again.");
            break;
          default:
            console.log("An unknown error occurred: ", error);
        }
      } else {
        console.log("An unknown error occurred: ", error);
      }
    }
  }

  GoogleSignin.configure({
    webClientId:
      "423846543027-92h9ktnme24mnk7jauakk7v2f1rqam2t.apps.googleusercontent.com",
  });

  async function onGoogleButtonPress() {
    try {
      // Check if the device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Initiate Google Sign-In and get the user's ID token
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error("No ID token returned from Google sign-in.");
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return await auth().signInWithCredential(googleCredential);
    } catch (error: unknown) {
      // Type narrowing for the 'error' object
      if (error instanceof Error) {
        console.error("Google sign-in error: ", error.message);
      }

      // Handle different error types with specific codes
      if (typeof error === "object" && error !== null && "code" in error) {
        const errorCode = (error as { code: string }).code;

        if (errorCode === statusCodes.SIGN_IN_CANCELLED) {
          console.log("Sign-in cancelled");
        } else if (errorCode === statusCodes.IN_PROGRESS) {
          console.log("Sign-in already in progress");
        } else if (errorCode === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log("Play Services not available or outdated");
        } else {
          console.log("An unknown error occurred: ", error);
        }
      } else {
        console.log("An unknown error occurred: ", error);
      }
    }
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
            width: 330,
            height: 45,
            marginLeft: 20,
            marginTop: 5,
          }}
          onPress={() => onAppleButtonPress()}
        />
      </View>

      <GoogleSigninButton
        style={{
          width: 340,
          height: 50,
          marginVertical: 16,
          marginLeft: 15,
          elevation: 2,
        }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
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
