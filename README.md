# Next.js 项目初始化

## 1.脚手架搭建

> npx create-next-app@latest

生成目录：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/26685644/1694435324966-ab77ed1d-2c6f-4a2e-a55c-7d41eee96af5.png#averageHue=%2325292d&clientId=u878ed8fc-c464-4&from=paste&height=346&id=u7d037ff4&originHeight=722&originWidth=415&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=49867&status=done&style=none&taskId=ue8c64b5f-09d1-49d2-ba05-ba07a2f537b&title=&width=198.66668701171875)
我生成的 package.json:

```javascript
{
  "name": "nest-initial-demo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@types/node": "20.6.0",
    "@types/react": "18.2.21",
    "@types/react-dom": "18.2.7",
    "eslint": "8.49.0",
    "eslint-config-next": "13.4.19",
    "next": "13.4.19",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.2.2"
  }
}

```

## 2.样式依赖安装

- npm i normalize.css --save
- npm i sass --save
- npm i classnames --save

### 引入全局

```javascript
import "normalize.css";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

tsconfig.json@引入配置
![image.png](https://cdn.nlark.com/yuque/0/2023/png/26685644/1694436474879-b074ba6c-e425-4964-96e7-15f048efe78f.png#averageHue=%2322211f&clientId=u878ed8fc-c464-4&from=paste&height=201&id=u9475009a&originHeight=301&originWidth=535&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=36884&status=done&style=none&taskId=u1ee8049b-c2cd-42d0-8fc8-1afc3a9f46a&title=&width=356.6666666666667)

## 3.head 配置：

```javascript
// 这个四个属性是必须的
import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="react next demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="hy-body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

## 3.reduxjs/toolkit 集成

> npm i next-redux-wrapper --save

- 可以避免在访问服务器端渲染页面时 store 的重置
- 该库可以将服务器端 redux 存的数据，同步一份到客户端上
- 该库提供了 HYDRATE 调度操作
  - ➢ 当用户访问动态路由或后端渲染的页面时，会执行 Hydration 来保持两端数据状态一致
  - ➢ 比如：每次当用户打开使用了 getStaticProps 或 getServerSideProps 函数生成的页面时，HYDRATE 将执行调度操作。

> npm i @reduxjs/toolkit react-redux --save

![image.png](https://cdn.nlark.com/yuque/0/2023/png/26685644/1694489693890-cf17b6f1-c53d-4566-b522-5e6f300d51f9.png#averageHue=%23212f38&clientId=u878ed8fc-c464-4&from=paste&height=117&id=u51f2b42f&originHeight=176&originWidth=479&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=12661&status=done&style=none&taskId=u77b19e93-e86d-4a6e-8201-d87f05b6e15&title=&width=319.3333333333333)

### numberDemo

```typescript
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
        ...action.payload.home, // payload:rootSate
      };
    });
  },
});
export const { increment } = numberSlice.actions;
export default numberSlice.reducer;
```

> extraReducer：添加更多额外 reducer 处理 other action

#### app 集成

```tsx
import "normalize.css";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "@/components/C-user/layout";
import warpper from "../store";
import { Provider } from "react-redux";

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = warpper.useWrappedStore(rest);
  return (
    <div>
      <Provider store={store}>
        <Layout>
          <Component {...props.pageProps} />
        </Layout>
      </Provider>
    </div>
  );
}
```

#### 使用

```tsx
import { useDispatch, useSelector } from "react-redux";
import { IAppDispatch, IAppState } from "../store";
import { increment } from "@/store/C-demo/numberDemo";

export default function Home() {
  const { numberDemo } = useSelector((rootState: IAppState) => {
    return {
      numberDemo: rootState.numberDemo.counter,
    };
  });
  const dispatch: IAppDispatch = useDispatch();
  function addNumber() {
    dispatch(increment(2));
  }
  return (
    <div style={{ minHeight: "400px", background: "#DADAE5" }}>
      <button onClick={addNumber}>add2</button>
      number:{numberDemo}
    </div>
  );
}
```

### requestDemo

```typescript
import { getHomeInfoData } from "@/service/user/index";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
export interface IHomeInfo {
  banners?: any[];
  categorys?: any[];
  recommends?: any[];
  digitalData?: any;
}
interface IInitialState {
  requestDemoInfo: IHomeInfo;
}
const requestSlice = createSlice({
  name: "requestDemo",
  initialState: {
    requestDemoInfo: {},
  } as IInitialState,
  reducers: {
    // 默认参数就有类型提示了
    changeNavbarAction(state, action) {
      state.requestDemoInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload.requestDemo, // hydration home模块数据
      };
    });
  },
});
// 异步的action
export const fetchHomeInfoAction = createAsyncThunk(
  "fetchHomeInfoAction",
  async (payload: number, { dispatch }) => {
    // console.log("payload=>", payload);
    const res = await getHomeInfoData();
    dispatch(requestSlice.actions.changeNavbarAction(res.data));
  }
);

export const { changeNavbarAction } = requestSlice.actions;
export default requestSlice.reducer;
```

### index 使用

```typescript
import { useDispatch, useSelector } from "react-redux";
import { IAppDispatch, IAppState, wrapper } from "@/store/index";
import { increment } from "@/store/C-demo/numberDemo";
import { GetServerSideProps } from "next";
import { getHomeInfoData } from "@/service/user";
import { useCallback, useEffect, useState } from "react";
import { fetchHomeInfoAction } from "@/store/C-demo/requestDemo";
interface listRoot {
  id: number;
  productId: number;
  picId: number;
  backendPicId: number;
  addTime: number;
  position: number;
  type: number;
  url: string;
  bannerExtJson: any;
  isSetTime: number;
  beginTime: number;
  endTime: any;
  picStr: string;
  backendPicStr: string;
}

export default function Home() {
  const { numberDemo } = useSelector((rootState: IAppState) => {
    return {
      numberDemo: rootState.numberDemo.counter,
    };
  });
  const { requestDemo } = useSelector((rootState: IAppState) => {
    return {
      requestDemo: rootState.requestDemo.requestDemoInfo,
    };
  });
  const dispatch: IAppDispatch = useDispatch();
  function addNumber() {
    dispatch(increment(2));
  }
  const [bannersList, setBannersList] = useState<listRoot[]>([]);
  const getUserCb = useCallback(() => getHomeInfoData(), [numberDemo]);
  useEffect(() => {
    getUserCb()
      .then((res) => {
        console.log(res);
        if (res.data.banners) setBannersList(res.data.banners);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getUserCb]);
  return (
    <div style={{ minHeight: "400px", background: "#DADAE5" }}>
      <button onClick={addNumber}>add2</button>
      number:{numberDemo}
      <div>
        直接的List:
        <ul>
          {bannersList.map((item) => {
            return <li key={item.id}>{item.picStr}</li>;
          })}
        </ul>
        redux的List:
        {requestDemo?.banners && (
          <ul>
            {requestDemo?.banners.map((item) => {
              return <li key={item.id}>{item.picStr}</li>;
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(function (store) {
    return async (context) => {
      await store.dispatch(fetchHomeInfoAction(1));
      return {
        props: {},
      };
    };
  });
```

## 集成网络请求 request 封装

> npm install axios

src 建立 service 文件：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/26685644/1694942622181-5d4a97f5-c4a4-4c33-8214-1ba1e6c70d1f.png#averageHue=%232d3135&clientId=ud1150597-53ff-4&from=paste&height=137&id=ubd5be3b9&originHeight=206&originWidth=348&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=10561&status=done&style=none&taskId=ue79e8b8d-20e2-4771-af29-6a3c28164dc&title=&width=232)

## 4.集成 ant-design

> npm install antd --save
> npm install @types/antd --save-dev

\_app 全局导入：
import "antd/dist/reset.css";
页面调用：
import { Button } from "antd";

# Github 地址

[https://github.com/wzz778/nest-initial-demo](https://github.com/wzz778/nest-initial-demo)
