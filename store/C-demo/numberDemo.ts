import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const numberSlice = createSlice({
  name: "numberDemo",
  initialState: {
    counter: 100,
  },
  reducers: {
    // 默认参数就有类型提示了
    increment(state, action) {
      state.counter = action.payload + state.counter;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state, // 当前模块的state
        ...action.payload.numberSlice, // payload:rootSate
      };
    });
  },
});
export const { increment } = numberSlice.actions;
export default numberSlice.reducer;
