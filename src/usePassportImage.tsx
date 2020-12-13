import React, { useRef, useState, useCallback } from "react";
import Passport from "./Passport";
import { CommonPassportArgs } from "./CommonPassportArgs";
import { makePath } from "./RandomPassport";
import html2canvas from "html2canvas";

const usePassportImage = (hookArgs: CommonPassportArgs = {}) => {
  const onRenderRef = useRef<((value: HTMLCanvasElement) => void) | null>(null);
  const [path, setPath] = useState("");
  const [invocationArgs, setInvocationArgs] = useState<CommonPassportArgs>({});

  const cb = useCallback(
    (a: CommonPassportArgs = {}) => {
      return new Promise<HTMLCanvasElement>(async (resolve) => {
        setInvocationArgs(a);
        onRenderRef.current = resolve;
        setPath(await makePath((hookArgs?.test || a?.test) ?? false));
      });
    },
    [hookArgs]
  );

  const onLayout = useCallback((elem: HTMLElement) => {
    const layoutDone = async (onRender: (a: HTMLCanvasElement) => void) => {
      if (elem) {
        const canvas = await html2canvas(elem);
        onRender(canvas);
      }
    };
    if (onRenderRef.current) {
      layoutDone(onRenderRef.current);
      onRenderRef.current = null;
    }
  }, []);

  const elem = (
    <div
      style={{
        overflow: "hidden",
        width: "300px",
        height: 0,
        position: "absolute",
      }}
    >
      <Passport
        path={path}
        onLayout={onLayout}
        {...{ ...hookArgs, ...invocationArgs }}
      />
    </div>
  );
  return [elem, cb] as const;
};

export default usePassportImage;
