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
