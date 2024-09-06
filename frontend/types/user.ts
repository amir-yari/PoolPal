type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  loggedIn: boolean;
};

export default User;
