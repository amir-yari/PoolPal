import { useEffect } from "react";

import * as LocalAuthentication from "expo-local-authentication";

import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();

  useEffect(() => {
    const faceID = async () => {
      const { success } = await LocalAuthentication.authenticateAsync();
      if (success) {
        router.push("/(tabs)/poolPal/");
      }
    };

    faceID();
  }, []);
};

export default index;
