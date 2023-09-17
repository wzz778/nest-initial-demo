import hyRequest from "../index";

import type { ResultData } from "../index";

export interface IHomeInfo {
  banners?: any[];
  categorys?: any[];
  recommends?: any[];
  digitalData?: any;
}
// 获取首页其它信息
export const getHomeInfoData = () => {
  return hyRequest.get<ResultData<IHomeInfo>>("/home/info");
};
