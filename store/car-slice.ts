import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import Car from "../types/car";

type CarState = {
  items: Car[];
  selectedCar?: Car;
};

const initialState: CarState = {
  items: [],
  selectedCar: undefined,
};

export const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    setCars(state, action: PayloadAction<Car[]>) {
      state.items = action.payload;
    },
    setCar(state, action: PayloadAction<Car>) {
      const car = action.payload;
      state.selectedCar = car;
      const index = state.items.findIndex((item) => item.carId === car.carId);
      if (index !== -1) {
        state.items[index] = car;
      } else {
        state.items.push(car);
      }
    },
  },
});

export const carActions = carSlice.actions;

export default carSlice;
