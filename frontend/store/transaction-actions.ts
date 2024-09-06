import { AppDispatch } from "./store";
import { transactionActions } from "./transaction-slice";
import { FIRESTORE_DB } from "../firebaseConfig";
import Transaction from "../types/transaction";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
  DocumentSnapshot,
} from "firebase/firestore";
import User from "../types/user";

const generateId = () => {
  return `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export const addTransaction = (transaction: Transaction, user: User) => {
  return async (dispatch: AppDispatch) => {
    const userIsLoggedIn = user.loggedIn;
    const transactionWithId = { ...transaction, id: generateId() };

    if (userIsLoggedIn) {
      try {
        dispatch(transactionActions.addTransaction(transactionWithId));
        await setDoc(
          doc(
            FIRESTORE_DB,
            `users/${user.uid}/transactions`,
            transactionWithId.id
          ),
          {
            type: transactionWithId.type,
            title: transactionWithId.title,
            amount: transactionWithId.amount,
            date: transactionWithId.date,
          }
        );
      } catch (error) {
        console.error("Failed to save transaction:", error);
      }
    } else {
      dispatch(transactionActions.addTransaction(transactionWithId));
    }
  };
};

export const updateTransaction = (transaction: Transaction, user: User) => {
  return async (dispatch: AppDispatch) => {
    try {
      const transactionDoc = doc(
        collection(FIRESTORE_DB, `users/${user.uid}/transactions`),
        transaction.id
      );
      dispatch(transactionActions.updateTransaction(transaction));

      await updateDoc(transactionDoc, {
        type: transaction.type,
        title: transaction.title,
        amount: transaction.amount,
        date: transaction.date,
      });
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };
};

export const deleteTransaction = (transactionId: string, user: User) => {
  return async (dispatch: AppDispatch) => {
    try {
      const transactionDoc = doc(
        collection(FIRESTORE_DB, `users/${user.uid}/transactions`),
        transactionId
      );

      dispatch(transactionActions.deleteTransaction(transactionId));
      await deleteDoc(transactionDoc);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };
};

export const syncTransactionsToCloud = (
  user: User,
  localTransactions: Transaction[]
) => {
  return async (dispatch: AppDispatch) => {
    try {
      await Promise.all(
        localTransactions.map((transaction) => {
          return setDoc(
            doc(FIRESTORE_DB, `users/${user.uid}/transactions`, transaction.id),
            {
              type: transaction.type,
              title: transaction.title,
              amount: transaction.amount,
              date: transaction.date,
            }
          );
        })
      );
      console.log("Transactions synced successfully");
    } catch (error) {
      console.error("Failed to save transactions:", error);
    }
  };
};

export const fetchTransactionsFromCloud = (user: User) => {
  return async (dispatch: AppDispatch) => {
    try {
      const transactionsCollection = collection(
        FIRESTORE_DB,
        `users/${user.uid}/transactions`
      );

      const snapshot = await getDocs(transactionsCollection);

      const transactions: Transaction[] = snapshot.docs.map(
        (doc: DocumentSnapshot) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data?.type,
            title: data?.title,
            amount: data?.amount,
            date: data?.date,
          };
        }
      );

      dispatch(transactionActions.setTransactions(transactions));
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };
};
