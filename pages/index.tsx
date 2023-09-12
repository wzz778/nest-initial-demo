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
