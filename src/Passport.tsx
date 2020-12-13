import React, { FC, useRef, useLayoutEffect, useMemo } from "react";
import QRCode from "qrcode.react";
import { CommonPassportArgs } from "./CommonPassportArgs";

const Passport: FC<
  CommonPassportArgs & {
    path: string;
    onLayout?: (elem: HTMLElement) => void;
  }
> = ({ path, rotate, test, message, frame = true, onLayout }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mainStyle = rotate
    ? ({
        transform: "rotate(90deg)",
        backgroundColor: "transparent",
      } as const)
    : {};

  useLayoutEffect(() => {
    if (onLayout && ref.current) {
      onLayout(ref.current);
    }
  });
  const isTest = useMemo(
    () => test || !path.toLowerCase().startsWith("https://vaxassure.me/"),
    [path, test]
  );

  return (
    <div
      ref={ref}
      style={{
        width: "203px",
        height: "353px",
        position: "relative",
        ...mainStyle,
      }}
    >
      {isTest && (
        <div
          style={{
            transform: "translate(29px, 66px) rotate(45deg)",
            color: "#ff8080",
            fontSize: "36px",
            position: "absolute",
            fontWeight: 900,
          }}
        >
          Test Only
        </div>
      )}
      <div
        style={{
          color: "black",
          border: `thin solid ${frame ? "black" : "white"}`,
          borderRadius: "10px",
          width: "180px",
          height: "330px",
          padding: "10px",
          position: "absolute",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            height: "96%",
          }}
        >
          <h1
            style={{
              fontFamily: "'Cinzel'",
              fontSize: "32px",
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            VaxAssure
          </h1>
          <div style={{ height: 12, fontSize: "10px" }}>{message}</div>
          <div
            style={{
              fontSize: "14px",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              padding: "10px 0",
            }}
          >
            <img style={{ width: 75 }} src="./logo-color.svg" alt="" />
            <p
              style={{
                fontSize: "12px",
                fontWeight: 500,
                width: "105px",
                fontFamily: '"Source Sans Pro"',
              }}
            >
              Scan this card to verify the bearer’s vaccination status
            </p>
          </div>
          <div>
            <QRCode
              value={path}
              size={180}
              fgColor="black"
              bgColor="transparent"
              renderAs="svg"
              includeMargin={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passport;
