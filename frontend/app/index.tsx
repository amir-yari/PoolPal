// import { useEffect } from "react";

// import * as LocalAuthentication from "expo-local-authentication";

// import { useRouter } from "expo-router";

// const Auth = () => {
//   const router = useRouter();
//   console.log("hello");

//     useEffect(() => {
//       const faceID = async () => {
//         const { success } = await LocalAuthentication.authenticateAsync();
//         if (success) {
//           router.push("/(tabs)/");
//         }
//       };

//       faceID();
//     }, []);
// };

// export default Auth;

import { Redirect } from "expo-router";

const index = () => {
  return <Redirect href="/(tabs)/poolPal/" />;
};

export default index;
