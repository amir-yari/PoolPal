import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import { AppDispatch, RootState } from "./store";

type DispatchFunction = () => AppDispatch;

// export const useCarDispatch: DispatchFunction = useDispatch;
// export const useCarSelector: TypedUseSelectorHook<RootState> = useSelector;
