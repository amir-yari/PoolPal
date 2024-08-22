import Transaction from "../types/transaction";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import dayjs from "dayjs";

type TransactionState = {
  items: Transaction[];
  selectedTransaction?: Transaction;
};

const initialState: TransactionState = {
  items: [],
  selectedTransaction: undefined,
};

const generateId = () => {
  return `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.items = action.payload;
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      const newTransaction = {
        ...action.payload,
        id: generateId(),
      };

      state.items.push(newTransaction);

      state.items.sort((a, b) => {
        const dayA = dayjs(a.date).date();
        const dayB = dayjs(b.date).date();
        return dayB - dayA;
      });
    },

    updateTransaction(state, action: PayloadAction<Transaction>) {
      const transaction = action.payload;
      const index = state.items.findIndex((item) => item.id === transaction.id);
      if (index !== -1) {
        state.items[index] = transaction;
      }
    },
    deleteTransaction(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setSelectedTransaction(state, action: PayloadAction<string | undefined>) {
      state.selectedTransaction = state.items.find(
        (item) => item.id === action.payload
      );
    },
  },
});

export const transactionActions = transactionSlice.actions;

export default transactionSlice;
