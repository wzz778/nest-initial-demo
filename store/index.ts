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
const warpper = createWrapper(() => store);
export default warpper;
export type IAppDispatch = typeof store.dispatch;
export type IAppState = ReturnType<typeof store.getState>;
