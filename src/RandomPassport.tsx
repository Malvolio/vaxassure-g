import _ from "lodash";
import React, { FC, useState, useEffect } from "react";
import { CommonPassportArgs } from "./CommonPassportArgs";
import Passport from "./Passport";

const pickFrom = (a: string) => a.charAt(_.random(0, a.length));

const randomString = (len: number) => {
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
  return _.map(_.range(0, len), () => pickFrom(alphabet)).join("");
};

const makePassword = async (): Promise<string> => {
  if (window.location.protocol === "https:") {
    const key = await window.crypto.subtle.generateKey(
      { name: "AES-CBC", length: 256 },
      true,
      ["encrypt"]
    );
    const v = await window.crypto.subtle.exportKey("jwk", key);
    return v.k || "";
  } else {
    return randomString(15);
  }
};

const makePasswordId = () => randomString(28);

export const makePath = async (test: boolean): Promise<string> => {
  const passportId = makePasswordId();
  const password = await makePassword();
  const host = test ? "https://v.vaxassure.me" : "https://vaxassure.me";

  return `${host}/#v/${passportId}/${password}`;
};

export const RandomPassport: FC<Omit<CommonPassportArgs, "path">> = (args) => {
  const [path, setPath] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    makePath(args.test ?? false)
      .then(setPath)
      .catch((e) => {
        setError(e.message);
      });
  }, [args.test]);
  return error ? (
    <p style={{ color: "red" }}>Error: {error}</p>
  ) : path ? (
    <Passport {...args} path={path} />
  ) : null;
};
