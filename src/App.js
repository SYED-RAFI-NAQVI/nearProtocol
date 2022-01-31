import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import { login, logout } from "./utils";
import "./global.css";
import background from "./assets/blob.svg";

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
import axios from "axios";

import Explore from "./components/Explore";

import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

import { CoinGeckoClient } from "coingecko-api-v3";
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
  const [showNotification, setShowNotification] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [selectedToken, setSelectedToken] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  const [lists, setLists] = useState([]);
  const [percentage, setPercentage] = useState([]);
  const [bundleName, setBundleName] = useState("");
  const [bundleSymbol, setBundleSymbol] = useState("");
  const [explore, setExplore] = useState(false);
  const [coinsData, setCoinsData] = useState([]);
  const totalPercentage = 100;
  let list = [];

  const steps = ["Choose Tokens", "Add Details", "Create"];

  useEffect(() => {
    const apiCalls = async () => {
      axios
        .get("https://api.coingecko.com/api/v3/coins?per_page=50")
        .then(({ data }) => {
          list = [...data];
          setCoinsData(list);
          const lists = data.map((item) => item.name);
          setTokenList(lists);
        });
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

  const handleRatio = (e, token) => {
    const newPercentage = [...percentage];
    let changingItem = newPercentage.filter((item) => item.name == token);
    changingItem[0].value = e.target.value;
    let otherItems = newPercentage.filter((item) => item.name != token);
    setPercentage([...otherItems, ...changingItem]);
  };

  const handleCreate = (e) => {
    stepCount <= 1 && setStepCount(stepCount + 1);
    axios
      .post("http://localhost:3000/mint_nft", {
        token_id: bundleName,
        metadata: JSON.stringify({
          bundleName,
          bundleSymbol,
          coins: percentage,
        }),
        account_id: "qwert1.testnet",
        private_key:
          "ed25519:4uNTLjkiYCBn9CG4P3xavFz5D1C6Zj8ug2b2DPWZg1oMvdeZ3n5hugQgkXh5pVffMW9Na3Dx7TqQuerCyZ2VHpiL",
        contract: "qwert1.testnet",
      })
      .then((res) =>
        axios
          .post("http://localhost:3000/transfer_nft", {
            token_id: bundleName,
            receiver_id: window.accountId,
            enforce_owner_id: "qwert1.testnet",
            memo: "Here's a token I thought you might like! :)",
            owner_private_key:
              "ed25519:4uNTLjkiYCBn9CG4P3xavFz5D1C6Zj8ug2b2DPWZg1oMvdeZ3n5hugQgkXh5pVffMW9Na3Dx7TqQuerCyZ2VHpiL",
            contract: "qwert1.testnet",
          })
          .then((response) => console.log(response))
      );
  };

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

  return (
    <>
      <Grid>
        <Grid style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button className="link" onClick={logout} color="error">
            Sign out
          </Button>
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
              onClick={() => setExplore(false)}
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
              onClick={() => setExplore(true)}
            >
              Explore
            </Button>
          </Grid>

          {!explore && (
            <Grid mt={5} mb={5}>
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
                      <Grid>
                        <ModalTitle title="Choose Your Tokens" />
                      </Grid>
                      <Grid>
                        {/* <Grid
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
                        <Typography style={{ fontWeight: 700 }}>100</Typography>
                      </Grid> */}
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
                                          {coinsData
                                            ?.filter(
                                              (item) => item.name == token
                                            )[0]
                                            .symbol.toUpperCase()}
                                        </Typography>
                                      </Grid>
                                      <Grid>
                                        <TextField
                                          type={"number"}
                                          placeholder="%"
                                          label="Ratio"
                                          onChange={(e) => {
                                            handleRatio(e, token);
                                          }}
                                        />
                                      </Grid>
                                      <Button
                                        style={{
                                          marginLeft: "auto",
                                          background: "none",
                                          color: "red",
                                        }}
                                        endIcon={
                                          <DeleteIcon fontSize="large" />
                                        }
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
                  {stepCount === 1 && (
                    <Grid>
                      <ModalTitle title="Create Your Index" />
                      <Grid textAlign={"center"} mt={1}>
                        <TextField
                          fullWidth
                          label="Name"
                          placeholder="Bundle Name"
                          onChange={(e) => setBundleName(e.target.value)}
                        />
                        <TextField
                          fullWidth
                          label="Symbol"
                          placeholder="Bundle Symbol"
                          style={{ marginTop: "0.6rem" }}
                          onChange={(e) => setBundleSymbol(e.target.value)}
                        />
                        {/* <Autocomplete
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
                      /> */}
                        <Grid mt={2}>
                          <Typography textAlign={"left"}>Details</Typography>

                          {percentage.length > 0 &&
                            percentage.map((token, index) => {
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
                                            {token.name}
                                          </Typography>
                                          {/* <Typography
                                            variant="caption"
                                            fontWeight={500}
                                            opacity={0.5}
                                          >
                                            {list
                                              ?.filter(
                                                (item) =>
                                                  item.name == token.name
                                              )[0]
                                              .symbol.toUpperCase()}
                                          </Typography> */}
                                        </Grid>
                                        <Grid></Grid>
                                        <Grid style={{ marginLeft: "auto" }}>
                                          <Typography
                                            variant="body1"
                                            fontWeight={700}
                                          >
                                            {token.value}%
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
                          stepCount <= 1 && setStepCount(stepCount + 1)
                        }
                        endIcon={<ArrowRightAltIcon />}
                      >
                        Next
                      </Button>
                    )}
                    {stepCount == 2 && (
                      <Button
                        onClick={() => handleCreate()}
                        variant="contained"
                      >
                        Create
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
          {explore && <Explore />}
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
