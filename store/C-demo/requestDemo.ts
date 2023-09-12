// import { fetchHomeInfo } from "./../../service/home";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const requestDemoSlice = createSlice({
  name: "requestDemo",
  initialState: {
    counter: 100,
    requestDemoInfo: {},
  },
  reducers: {
    // 默认参数就有类型提示了
    increment(state, action) {
      state.counter = action.payload + state.counter;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state, // 当前模块的state
          ...action.payload.home, // payload:rootSate
        };
      })
      .addCase(fetchHomeInfoAction.fulfilled, (state, action) => {
        state.requestDemoInfo = action.payload;
      });
  },
});
// 异步的action
export const fetchHomeInfoAction = createAsyncThunk(
  "fetchHomeInfoAction",
  async (payload?: number) => {
    console.log("payload=>", payload);
    // const res = await fetchHomeInfo();
    // return res;
    return "1";
  }
);
export const { increment } = requestDemoSlice.actions;
export default requestDemoSlice.reducer;
