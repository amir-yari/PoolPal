import Transaction from "../types/transaction";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import dayjs from "dayjs";

type TransactionState = {
  items: Transaction[];
};

const initialState: TransactionState = {
  items: [],
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.items = action.payload;
      state.items.sort((a, b) => {
        return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
      });
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      const newTransaction = {
        ...action.payload,
      };

      state.items.push(newTransaction);

      state.items.sort((a, b) => {
        return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
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
  },
});

export const transactionActions = transactionSlice.actions;

export default transactionSlice;
