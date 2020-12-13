import _ from "lodash";
import React, { FC, useCallback, useState } from "react";
import QrReader from "react-qr-reader";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./App.css";
import { RandomPassport } from "./RandomPassport";
import useDownload from "./useDownload";
import Passport from "./Passport";
import Switch from "@material-ui/core/Switch";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontWeight: 700,
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "45%",
    flexShrink: 0,
    textAlign: "right",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    marginLeft: 30,
  },
  panel: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    margin: 10,
  },
  panelExplanation: {
    border: "thin solid lightgray",
    borderRadius: "5px",
    padding: "5px 10px",
    width: 300,
    textAlign: "left",
    margin: 10,
  },
  panelForm: {
    border: "thin solid lightgray",
    flexGrow: 1,
    margin: 10,
  },
}));

const PrintImage: FC<{
  doDownloadImage: (a: { message: string }) => void;
  disabled?: boolean;
}> = ({ doDownloadImage, disabled }) => {
  const classes = useStyles();

  const [message, setMessage] = useState("");
  const onClick = useCallback(() => {
    doDownloadImage({ message });
  }, [doDownloadImage, message]);
  return (
    <div className={classes.panel}>
      <div className={classes.panelExplanation}>
        <p>
          Download a single passport. You can save this as an image or in your
          Apple wallet, or print it out and keep it.
        </p>
        <p>
          When you go for your vaccination, the nurse will activate this
          passport.
        </p>
        <p>
          After you have been vaccinated, you can show this passport at sporting
          events, airports, restaurants, anywhere you need to prove that you
          have been vaccinated!
        </p>
      </div>
      <div className={classes.panelForm}>
        <div>
          <div>
            <FormControl>
              <InputLabel htmlFor="pp-massage">Message</InputLabel>
              <Input
                onChange={(e) => setMessage(e.currentTarget.value)}
                value={message}
                id="pp-massage"
                aria-describedby="pp-massage-text"
              />
              <FormHelperText id="pp-massage-text">
                This message will be written in small type on your passport. It
                is useful if you are keep passports for several people.
              </FormHelperText>
            </FormControl>
          </div>
          <div style={{ marginTop: 10 }}>
            <FormControl>
              <Button variant="contained" onClick={onClick} disabled={disabled}>
                Print Image
              </Button>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _Blank: FC<{}> = () => {
  const classes = useStyles();

  return (
    <div className={classes.panel}>
      <div className={classes.panelExplanation}>
        <p>
          Download a single passport. You can save this as an image or in your
          Apple wallet, or print it out and keep it.
        </p>
        <p>
          When you go for your vaccination, the nurse will activate this
          passport.
        </p>
        <p>
          After you have been vaccinated, you can show this passport at sporting
          events, airports, restaurants, anywhere you need to prove that you
          have been vaccinated!
        </p>
      </div>
      <div className={classes.panelForm}></div>
    </div>
  );
};

const Sample: FC<{}> = () => {
  const classes = useStyles();

  return (
    <div className={classes.panel}>
      <div className={classes.panelExplanation}>
        <p>This is a typical passport.</p>
      </div>
      <div className={classes.panelForm}>
        <RandomPassport
          rotate={false}
          test={true}
          message="your message here"
        />
      </div>
    </div>
  );
};

const PrintPage: FC<{
  doDownloadPDF: () => void;
  disabled?: boolean;
}> = ({ doDownloadPDF, disabled }) => {
  const classes = useStyles();
  const dDoDownloadPDF = useCallback(() => doDownloadPDF(), [doDownloadPDF]);

  return (
    <div className={classes.panel}>
      <div className={classes.panelExplanation}>
        <p>
          This will give you a page of 10 passports, suitable for printing on
          standard business-card forms, such as Avery 5781.
        </p>
      </div>
      <div className={classes.panelForm}>
        <div>
          <div>
            <FormControl>
              <InputLabel htmlFor="pp-test">Test</InputLabel>
              <Switch
                checked={true}
                type="checkbox"
                disabled
                id="pp-test"
                aria-describedby="pp-test-text"
              />
              <FormHelperText id="pp-test-text">
                This message will be written in small type on your passport. It
                is useful if you are keep passports for several people.
              </FormHelperText>
            </FormControl>
          </div>
          <div style={{ marginTop: 10 }}>
            <FormControl>
              <Button
                variant="contained"
                onClick={dDoDownloadPDF}
                disabled={disabled}
              >
                Print PDF
              </Button>
            </FormControl>
          </div>
          <div style={{ height: 20 }}> {disabled ? "BUSY" : ""}</div>
        </div>
      </div>
    </div>
  );
};

const Rescan: FC<{ display: boolean }> = ({ display }) => {
  const classes = useStyles();
  const [path, setPath] = useState("");
  const onScan = useCallback((data: string | null) => {
    data && setPath(data);
  }, []);

  return (
    <div className={classes.panel}>
      <div className={classes.panelExplanation}>
        <p>
          If your hard-copy passport is getting worn or dirty — or if you just
          want a clean electronic copy of it, scan it hear.
        </p>
        <p>
          Give us permission to use your camera and then hold your current
          passport so it shows up in the box at left.
        </p>
        <p>
          Do <b>not</b> copy passports belonging to anyone else without their
          consent!
        </p>
      </div>
      <div className={classes.panelForm}>
        {display && !path && (
          <QrReader
            style={{ width: 200 }}
            onError={console.error}
            onScan={onScan}
          />
        )}
        {path && <Passport path={path} />}
        {path && (
          <Button variant="contained" onClick={() => setPath("")}>
            Rescan
          </Button>
        )}
      </div>
    </div>
  );
};

const AccordionPanel: FC<{
  title: string;
  subtitle?: string;
  name: string;
  expanded: string;
  onClick: (name: string) => void;
}> = ({ title, name, expanded, onClick, subtitle, children }) => {
  const classes = useStyles();
  const doClick = useCallback(() => {
    onClick(name);
  }, [onClick, name]);
  const isExpanded = expanded === name;
  return (
    <Accordion
      onClick={doClick}
      expanded={isExpanded}
      style={{ flexGrow: isExpanded ? 1 : 0 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{title}</Typography>
        <Typography className={classes.secondaryHeading}>{subtitle}</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ overflowY: "auto" }}>
        {_.isFunction(children) ? children(isExpanded) : children}
      </AccordionDetails>
    </Accordion>
  );
};

function App() {
  const [expanded, setExpanded] = React.useState("samplePanel");

  const { busy, printerElement, doDownloadPDF, doDownloadImage } = useDownload({
    test: true,
  });

  return (
    <div className="App">
      <h1
        style={{
          fontFamily: "'Cinzel'",
        }}
      >
        Generating VaxAssure Passports
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AccordionPanel
          title="Sample"
          name="samplePanel"
          expanded={expanded}
          onClick={setExpanded}
        >
          <Sample />
        </AccordionPanel>

        <AccordionPanel
          title="Download one passport"
          subtitle="for yourself and your family members"
          name="downloadImagePanel"
          expanded={expanded}
          onClick={setExpanded}
        >
          <PrintImage doDownloadImage={doDownloadImage} disabled={busy} />
        </AccordionPanel>
        <AccordionPanel
          title="Download a page of passports"
          subtitle="for doctors and health-care workers"
          name="downloadPagePanel"
          expanded={expanded}
          onClick={setExpanded}
        >
          <PrintPage doDownloadPDF={doDownloadPDF} disabled={busy} />
        </AccordionPanel>
        <AccordionPanel
          title="Rescan your passports"
          subtitle="if your paper passport is getting old"
          name="rescanPanel"
          expanded={expanded}
          onClick={setExpanded}
        >
          {(display: boolean) => <Rescan display={display} />}
        </AccordionPanel>
      </div>
      <div>{printerElement}</div>
    </div>
  );
}

export default App;
