import { configureStore } from "@reduxjs/toolkit";
import numberDemo from "./C-demo/numberDemo";
import requestDemo from "./C-demo/requestDemo";
import { createWrapper } from "next-redux-wrapper";

const store = configureStore({
  reducer: {
    numberDemo: numberDemo,
    requestDemo: requestDemo,
  },
});
const makeStore = () => store;
export const wrapper = createWrapper(makeStore);
export type IAppDispatch = typeof store.dispatch;
export type IAppState = ReturnType<typeof store.getState>;
