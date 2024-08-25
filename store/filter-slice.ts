import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import dayjs from "dayjs";

type Filter = { selectedYear: string; selectedMonth: string };

const initialState: Filter = {
  selectedYear: dayjs().year().toString(),
  selectedMonth: dayjs().format("MMMM"),
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<Filter>) {
      return { ...state, ...action.payload };
    },
  },
});

export const filterActions = filterSlice.actions;

export default filterSlice;
