import _ from "lodash";
import { useCallback, useState } from "react";
import "./App.css";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import usePassportImage from "./usePassportImage";
import { CommonPassportArgs } from "./CommonPassportArgs";

const justSuffix = (s: string) =>
  _.filter(s.toLowerCase().split(""), (c) => !!/[a-z0-9]/.exec(c)).join("");

const suffixFor = (s: string | undefined) => {
  const x = s && justSuffix(s);
  return s ? "-" + x : "";
};

const useDownload = (hookArgs: CommonPassportArgs = {}) => {
  const [busy, setBusy] = useState(false);

  const [printerElement, getPassport] = usePassportImage();

  const doDownloadPDF = useCallback(
    (invocationArgs: Omit<CommonPassportArgs, "rotate"> = {}) => {
      const COLS_PER_ROW = 2;
      const COL_WIDTH = 195;
      const LEFT_MARGIN = 40;
      const ROW_HEIGHT = 115;
      const TOP_MARGIN = 35;
      setBusy(true);

      const awaitDownload = async () => {
        const scale = 0.5;
        const pdf = new jsPDF("p", "px");
        for (let i = 0; i < 10; i++) {
          const row = ~~(i / COLS_PER_ROW);
          const col = i % COLS_PER_ROW;
          const canvas = await getPassport({
            frame: false,
            ...hookArgs,
            ...invocationArgs,
            rotate: true,
          });
          const image = canvas.toDataURL("image/png");
          const width = parseInt(canvas.style.width);
          const height = parseInt(canvas.style.height);

          pdf.addImage(
            image,
            "PNG",
            col * COL_WIDTH + LEFT_MARGIN,
            row * ROW_HEIGHT + TOP_MARGIN,
            width * scale,
            height * scale
          );
        }
        await pdf.save("download.pdf");
        setBusy(false);
      };
      awaitDownload();
    },
    [getPassport, hookArgs]
  );

  const doDownloadImage = useCallback(
    (invocationArgs: CommonPassportArgs = {}) => {
      setBusy(true);

      const awaitDownload = async () => {
        const canvas = await getPassport({
          ...hookArgs,
          ...invocationArgs,
        });
        await canvas.toBlob((blob) => {
          blob &&
            saveAs(
              blob,
              `passport${suffixFor(
                hookArgs.message || invocationArgs.message
              )}.png`
            );
        });
        setBusy(false);
      };
      awaitDownload();
    },
    [getPassport, hookArgs]
  );

  return { busy, printerElement, doDownloadPDF, doDownloadImage };
};

export default useDownload;
