import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import { login, logout } from "./utils";
import "./global.css";
import Logos from "./logo-black.svg";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ExploreIcon from "@mui/icons-material/Explore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Paper, TextField } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import Slider from "@mui/material/Slider";

import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

import { CoinGeckoClient } from "coingecko-api-v3";
import { values } from "regenerator-runtime/runtime";
const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  height: 400,
  backgroundColor: "rgb(13, 11, 38)",
  border: "none",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
  borderRadius: 6,
};

export default function App() {
  const [greeting, setGreeting] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [budget, setBudget] = useState();
  const [tokenBudget, setTokenBudget] = useState(0);
  const [selectedToken, setSelectedToken] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  const [lists, setLists] = useState([]);
  const [percentage, setPercentage] = useState([]);
  const totalPercentage = 100;

  const steps = ["Budget", "Choose Tokens", "Create"];

  //   [
  //     { name: "Budget", value: 10 },
  //     { name: "Choose Tokens", value: 20 },
  //     { name: "Create", value: 30 },
  //   ];

  useEffect(() => {
    const apiCalls = async () => {
      const list = await client.coinList();
      setLists(list);
      const lists = list.map((item) => item.name);
      setTokenList(lists);
    };

    apiCalls();

    if (window.walletConnection.isSignedIn()) {
      window.contract
        .getGreeting({ accountId: window.accountId })
        .then((greetingFromContract) => {
          setGreeting(greetingFromContract);
        });
    }
  }, []);

  const onSearchTokens = (event, value) => {
    let filteredToken = tokenList.filter((item) => item == value);
    if (
      filteredToken[0] &&
      selectedToken.length < 5 &&
      !selectedToken.includes(filteredToken[0])
    ) {
      setSelectedToken([...selectedToken, filteredToken[0]]);
      setPercentage([...percentage, { name: filteredToken[0], value: 0 }]);
    }
  };

  console.log(tokenBudget);

  if (!window.walletConnection.isSignedIn()) {
    return (
      <main style={{ backgroundColor: "#1f1d37" }}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            style={{ marginTop: "80px", fontWeight: "bold" }}
          >
            Login via NEAR Network
          </Typography>
          <Typography
            id="modal-modal-description"
            variant="body2"
            fontSize={16}
            style={{ paddingTop: "10px" }}
            color="rgba(151,148,182)"
          >
            Click button below to login or create new account
          </Typography>

          <Grid>
            <Button
              onClick={login}
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#4743fb -2.16%,#c750ff)",
                color: "white",
                marginTop: "2.5rem",
                fontSize: "22px",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              Sign in with NEAR Wallet
            </Button>
          </Grid>
        </Box>
      </main>
    );
  }

  const handleGet = async () => {
    await window.contract.getUrl({
      name: "ram",
    });
  };
  const handleAdd = async () => {
    await window.contract.addUrl({
      name: "ram",
      tokenName: "ramToken2313",
    });
  };

  return (
    <>
      <Grid>
        <Grid style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button className="link" onClick={logout} color="error">
            Sign out
          </Button>
          <Button onClick={handleGet}>Get</Button>
          <Button onClick={handleAdd}>Add</Button>
        </Grid>

        <Container maxWidth="md">
          <Grid mt={10} textAlign={"center"}>
            <Typography
              variant="h1"
              style={{ fontWeight: "700", color: "#fff", fontSize: "90px" }}
            >
              Asset management for a{" "}
              <span
                style={{
                  background:
                    "-webkit-linear-gradient(90deg,#4743fb -2.16%,#c750ff)",
                  webkitBackgroundClip: "text",
                  webkitTextFillColor: "transparent",
                  backgroundImage:
                    "linear-gradient(90deg,#ede0d4 -2.16%,#e76f51)",
                }}
              >
                DeFi world
              </span>
            </Typography>
          </Grid>
          <Grid textAlign={"center"} mt={2}>
            <Typography
              variant="caption"
              style={{
                fontSize: "26px",
                fontStyle: "italic",
                color: "gray",
                opacity: 0.5,
              }}
            >
              Bring your crypto strategies to life with Set’s leading portfolio
              management tools.
            </Typography>
          </Grid>
          <Grid textAlign={"center"} mt={10}>
            <Button
              style={{
                fontSize: "32px",
                backgroundImage:
                  "linear-gradient(90deg,#4743fb -2.16%,#c750ff)",
                color: "white",
                borderRadius: "100px",
                padding: "25px",
                minWidth: "300px",
                marginRight: 40,
              }}
              endIcon={<AddCircleIcon style={{ fontSize: "36px" }} />}
            >
              Create
            </Button>
            <Button
              style={{
                fontSize: "32px",
                marginLeft: 40,
                backgroundImage:
                  "linear-gradient(90deg,#4743fb -2.16%,#c750ff)",
                color: "white",
                borderRadius: "100px",
                padding: "25px",
                minWidth: "300px",
              }}
              endIcon={<ExploreIcon style={{ fontSize: "36px" }} />}
            >
              Explore
            </Button>
          </Grid>

          <Grid mt={10} mb={100}>
            <Paper elevation={18}>
              <Grid p={5}>
                <Stepper activeStep={stepCount} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {stepCount === 0 && (
                  <Grid>
                    <ModalTitle title="Set Your Budget" />
                    <Grid>
                      <Grid
                        display={"flex"}
                        justifyContent={"flex-end"}
                        gap={"0.4rem"}
                        mt={1}
                      >
                        <Typography style={{ color: "gray", opacity: 0.8 }}>
                          Wallet Balance:{" "}
                        </Typography>
                        {/* <Typography style={{ fontWeight: 700 }}>
                          {window.accountInfo.amount.substring(0, 3)} N
                        </Typography> */}
                      </Grid>
                      <Grid
                        mt={2}
                        display={"flex"}
                        alignItems={"center"}
                        style={{ backgroundColor: "#f7f7f9" }}
                        padding={1}
                      >
                        <Grid sm={2}></Grid>
                        <Typography>Near</Typography>
                        <Grid sm={8}></Grid>
                        <TextField
                          label="Budget"
                          type={"number"}
                          fullWidth
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                      </Grid>
                      <Grid>
                        <Typography
                          variant="caption"
                          style={{ color: "gray", opacity: 0.8 }}
                        >
                          *Set the total amount you want to invest in this
                          portfolio
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {stepCount === 1 && (
                  <Grid>
                    <Grid>
                      <ModalTitle title="Choose Your Tokens" />
                    </Grid>
                    <Grid>
                      <Grid
                        display={"flex"}
                        justifyContent={"flex-end"}
                        gap={"0.4rem"}
                        mt={1}
                      >
                        <Typography style={{ color: "gray", opacity: 0.8 }}>
                          Your Budget
                        </Typography>
                        <Typography style={{ fontWeight: 700 }}>
                          {tokenBudget}
                        </Typography>{" "}
                        /
                        <Typography style={{ fontWeight: 700 }}>
                          {budget} N
                        </Typography>
                      </Grid>
                    </Grid>
                    <Autocomplete
                      id="combo-box-demo"
                      freeSolo
                      options={tokenList.sort((a, b) => -b.localeCompare(a))}
                      onChange={onSearchTokens}
                      limitTags={10}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            label="Select Tokens"
                            fullWidth
                            placeholder="Select Tokens"
                          />
                        );
                      }}
                    />
                    <Grid>
                      <Grid mt={2}>
                        {selectedToken.length > 0 && (
                          <Grid
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Typography>Your Tokens</Typography>
                            <Typography>{selectedToken.length}/5</Typography>
                          </Grid>
                        )}
                        {selectedToken.length > 0 &&
                          selectedToken.map((token, index) => (
                            // <TokenBox
                            //   token={token}
                            //   index={index}
                            //   lists={lists}
                            // />

                            <Grid mt={1}>
                              <Paper
                                style={{
                                  background: "#f8f9fa",
                                  textAlign: "center",
                                }}
                              >
                                <Box p={2}>
                                  <Grid
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "1fr 1fr 1fr",
                                    }}
                                    alignItems={"center"}
                                  >
                                    <Grid textAlign={"left"}>
                                      <Typography
                                        variant="body1"
                                        fontWeight={700}
                                      >
                                        {token}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        fontWeight={500}
                                        opacity={0.5}
                                      >
                                        {lists
                                          .filter(
                                            (item) => item.name == token
                                          )[0]
                                          .symbol.toUpperCase()}
                                      </Typography>
                                    </Grid>
                                    <Grid>
                                      <TextField
                                        type={"number"}
                                        placeholder="$"
                                        label="$"
                                        onChange={(e) => {
                                          setTokenBudget(
                                            (prev) =>
                                              prev + Number(e.target.value)
                                          );
                                          const newPercentage = [...percentage];
                                          let changingItem =
                                            newPercentage.filter(
                                              (item) => item.name == token
                                            );
                                          changingItem[0].value =
                                            e.target.value;
                                          let otherItems = newPercentage.filter(
                                            (item) => item.name != token
                                          );
                                          setPercentage([
                                            ...otherItems,
                                            ...changingItem,
                                          ]);
                                        }}
                                      />
                                    </Grid>
                                    <Button
                                      style={{
                                        marginLeft: "auto",
                                        background: "none",
                                        color: "red",
                                      }}
                                      endIcon={<DeleteIcon fontSize="large" />}
                                    ></Button>
                                  </Grid>
                                </Box>
                              </Paper>
                            </Grid>
                          ))}
                      </Grid>
                      {selectedToken.length === 0 && (
                        <Grid mt={1}>
                          <Paper
                            style={{
                              textAlign: "center",
                            }}
                          >
                            <Box p={10}>
                              <Typography
                                style={{ fontWeight: 700, opacity: 0.5 }}
                              >
                                Select Your Tokens
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                )}
                {stepCount === 2 && (
                  <Grid>
                    <ModalTitle title="Create Your Token" />
                    <Grid textAlign={"center"} mt={1}>
                      <TextField
                        fullWidth
                        label="Name"
                        placeholder="Bundle Name"
                      />
                      <TextField
                        fullWidth
                        label="Symbol"
                        placeholder="Bundle Symbol"
                        style={{ marginTop: "0.6rem" }}
                      />
                      <Autocomplete
                        style={{ marginTop: "0.6rem" }}
                        multiple
                        options={["#defi", "#erc20", "#erc721"]}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tags"
                            placeholder="Defi"
                          />
                        )}
                      />
                      {/* <Grid style={{ marginTop: "0.5rem" }}>
                        <hr />
                      </Grid> */}
                      <Grid mt={2}>
                        <Typography textAlign={"left"}>Details</Typography>
                        {selectedToken.length > 0 &&
                          selectedToken.map((token, index) => {
                            return (
                              <Grid mt={1}>
                                <Paper
                                  style={{
                                    background: "#f8f9fa",
                                    textAlign: "center",
                                  }}
                                >
                                  <Box p={2}>
                                    <Grid
                                      style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr 1fr",
                                      }}
                                      alignItems={"center"}
                                    >
                                      <Grid textAlign={"left"}>
                                        <Typography
                                          variant="body1"
                                          fontWeight={700}
                                        >
                                          {token}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          fontWeight={500}
                                          opacity={0.5}
                                        >
                                          {lists
                                            .filter(
                                              (item) => item.name == token
                                            )[0]
                                            .symbol.toUpperCase()}
                                        </Typography>
                                      </Grid>
                                      <Grid></Grid>
                                      <Grid style={{ marginLeft: "auto" }}>
                                        <Typography
                                          variant="body1"
                                          fontWeight={700}
                                        >
                                          20$
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Paper>
                              </Grid>
                            );
                          })}
                        <Grid textAlign={"right"} mt={2}>
                          <Typography>
                            <span style={{ opacity: 0.6, color: "gray" }}>
                              Total:
                            </span>{" "}
                            <span style={{ fontWeight: 700 }}>100$</span>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                <Grid
                  textAlign={"center"}
                  mt={5}
                  style={{
                    display: "flex",
                    justifyContent: `${
                      stepCount === 0 ? "flex-end" : "space-between"
                    }`,
                  }}
                >
                  {stepCount !== 0 && (
                    <Button
                      onClick={() =>
                        stepCount >= 1 && setStepCount(stepCount - 1)
                      }
                      startIcon={<ArrowBackIcon />}
                    >
                      Back
                    </Button>
                  )}
                  {stepCount !== 2 && (
                    <Button
                      onClick={() =>
                        stepCount <= 1 &&
                        budget > 0 &&
                        setStepCount(stepCount + 1)
                      }
                      endIcon={<ArrowRightAltIcon />}
                    >
                      Next
                    </Button>
                  )}
                  {stepCount == 2 && (
                    <Button
                      onClick={() =>
                        stepCount <= 1 && setStepCount(stepCount + 1)
                      }
                      variant="contained"
                    >
                      Create
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Container>
      </Grid>

      {showNotification && <Notification />}
    </>
  );
}

function ModalTitle({ title }) {
  return (
    <Grid textAlign={"center"} mt={2}>
      <Typography variant="h3" style={{ fontStyle: "bold" }}>
        {title}
      </Typography>
    </Grid>
  );
}

function Logo() {
  return (
    <Grid style={{ width: "200px", height: "300px" }}>
      <video width="400px" height="300px">
        <source src="assets/logo.mp4" type="video/mp4" />
      </video>
    </Grid>
  );
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
  return (
    <aside>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.accountId}`}
      >
        {window.accountId}
      </a>
      {
        " " /*  trims whitespace around tags; insert literal space character when needed */
      }
      called method: 'setGreeting' in contract:{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.contract.contractId}`}
      >
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  );
}
