import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import { AppDispatch, RootState } from "./store";

type DispatchFunction = () => AppDispatch;

export const useTransactionDispatch: DispatchFunction = useDispatch;
export const useTransactionSelector: TypedUseSelectorHook<RootState> =
  useSelector;

export const useFilterDispatch: DispatchFunction = useDispatch;
export const useFilterSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useUserDispatch: DispatchFunction = useDispatch;
export const useUserSelector: TypedUseSelectorHook<RootState> = useSelector;
