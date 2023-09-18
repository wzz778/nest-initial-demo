import { useDispatch, useSelector } from "react-redux";
import { IAppDispatch, IAppState, wrapper } from "@/store/index";
import { increment } from "@/store/C-demo/numberDemo";
import { GetServerSideProps } from "next";
import { getHomeInfoData } from "@/service/user";
import { useCallback, useEffect, useState } from "react";
import { fetchHomeInfoAction } from "@/store/C-demo/requestDemo";
import { Button } from "antd";
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
  const getUserCb = useCallback(() => getHomeInfoData(), []);
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
      <Button onClick={addNumber}>add2</Button>
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
