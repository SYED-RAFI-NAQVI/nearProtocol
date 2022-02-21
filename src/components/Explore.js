import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardMedia, Paper, TextField } from "@mui/material";
import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import Graph from "./Graph";
// import cardImg from "../assets/chart.png";
import ExploreIcon from "@mui/icons-material/Explore";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  // height: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

function Explore() {
  let navigate = useNavigate();
  const [data1, setData1] = useState([]);
  const [cardDataEnable, setCardDataEnable] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState([]);
  const [currencyHistory, setCurrencyHistory] = useState([]);
  const [allpercentage, setAllPercentage] = useState([]);
  const [variation, setVariation] = useState([]);
  const [currentCardData, setCurrentCardData] = useState([]);
  const [ohlcData, setOhlcData] = useState([]);
  const [eachPercentage, setEachPercentage] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const calculateEachPercentage = (price) => {
    let array = [];
    price.map((item, index) => {
      if (index === price.length - 1) {
        return;
      }
      array.push(Number(((price[index + 1][4] - item[4]) / 100).toFixed(4)));
    });
    return array;
  };

  const calculateAllSum = (...arrays) => {
    const n = arrays.reduce((max, xs) => Math.max(max, xs.length), 0);
    const result = Array.from({ length: n });
    setVariation(
      result.map((_, i) =>
        arrays.map((xs) => xs[i] || 0).reduce((sum, x) => sum + x, 0)
      )
    );
    return result.map((_, i) =>
      arrays.map((xs) => xs[i] || 0).reduce((sum, x) => sum + x, 0)
    );
  };

  const getData = async () => {
    const prices = {};
    const ohlcData = {};
    const coinsPercentage = {};
    let array = [];
    const bundlData = JSON.parse(
      await window.contract.getData({
        storageData1: "storageData1",
      })
    );
    bundlData.map((item) =>
      item.tokens.map((token) => {
        axios
          .post("http://localhost:3000/view_nft", {
            token_id: token,
            contract: "qwert1.testnet",
          })
          .then(({ data }) => {
            setData1((oldArray) => [...oldArray, JSON.parse(data.metadata)]);
            JSON.parse(data.metadata).coins.map(async (coin, index) => {
              axios
                .get(
                  `https://api.coingecko.com/api/v3/simple/price?ids=${coin.name
                    .toLowerCase()
                    .replace(/ /g, "")}&vs_currencies=usd`
                )
                .then((res) => {
                  prices[coin.name] = res.data
                    ? res.data[coin.name.toLowerCase()]?.usd
                    : 0;
                  axios
                    .get(
                      `https://api.coingecko.com/api/v3/coins/${coin.name
                        .toLowerCase()
                        .replace(/ /g, "")}/ohlc?vs_currency=usd&days=7`
                    )
                    .then((ohlc) => {
                      ohlcData[coin.name] = ohlc.data;
                      coinsPercentage[coin.name] = calculateEachPercentage(
                        ohlc.data
                      );
                      // array.push(calculateEachPercentage(ohlc.data));
                      setEachPercentage(coinsPercentage);
                      setOhlcData(ohlcData);
                    });
                  // .then(() => {
                  //   calculateAllSum(...array);
                  // });
                });
            });
          });
      })
    );

    setCurrentCurrency(prices);
    setCurrencyHistory(ohlcData);
    // setEachPercentage(array);
  };

  useEffect(async () => {
    await getData();
  }, []);

  const handleCardClick = (data) => {
    setAllPercentage([]);
    setCardDataEnable(true);
    setCurrentCardData(data);
    const bundle = data1.filter(
      (item) => item.bundleName === data.bundleName
    )[0];
    const coinNames = bundle.coins.map((item) => item.name);
    let data2 = calculateAllSum(
      ...coinNames.map((coin) => eachPercentage[coin])
    ).map((item) => {
      return { growth: Number((item / bundle.coins?.length).toFixed(4)) };
    });
    setAllPercentage(data2);
  };

  return (
    <Grid>
      {!cardDataEnable && (
        <Grid
          mt={5}
          mb={10}
          pl={20}
          pr={20}
          style={{
            display: "grid",
            gridTemplateRows: " repeat(4, 200px)",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          {data1 &&
            data1.map((data) => (
              <Grid>
                <Card
                  sx={{ maxWidth: 320 }}
                  onClick={() => handleCardClick(data)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "20px",
                    padding: "10px",
                  }}
                >
                  <CardContent>
                    <Typography variant="h4">{data.bundleName}</Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {data.bundleSymbol}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          <Grid mr={5}>
            <Card
              sx={{ maxWidth: 320 }}
              onClick={() => handleCardClick(data)}
              style={{
                cursor: "pointer",
                borderRadius: "20px",
                padding: "10px",
              }}
            >
              {/* <CardMedia
                component="img"
                height="140"
                style={{ padding: "10px" }}
                image={cardImg}
              /> */}
              <CardContent>
                <Typography variant="h5">{"data.bundleName"}</Typography>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {"BTC"}
                  </Typography>
                  <Typography
                    sx={{ mb: 1.5 }}
                    style={{
                      background: "rgb(46 204 66 / 1)",
                      color: "#fff",
                      padding: "1px 15px",
                      borderRadius: "10px",
                    }}
                  >
                    {"+25%"}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid mr={5}>
            <Card
              sx={{ maxWidth: 320 }}
              onClick={() => handleCardClick(data)}
              style={{
                cursor: "pointer",
                borderRadius: "20px",
                padding: "10px",
              }}
            >
              {/* <CardMedia
                component="img"
                height="140"
                style={{ padding: "10px" }}
                image={cardImg}
              /> */}
              <CardContent>
                <Typography variant="h5">{"data.bundleName"}</Typography>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {"BTC"}
                  </Typography>
                  <Typography
                    sx={{ mb: 1.5 }}
                    style={{
                      background: "rgb(46 204 66 / 1)",
                      color: "#fff",
                      padding: "1px 15px",
                      borderRadius: "10px",
                    }}
                  >
                    {"+25%"}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {cardDataEnable && (
        <Grid pt={5} pl={20} pr={20} pb={10}>
          <Grid mb={2}>
            <Button onClick={() => setCardDataEnable(false)}>Back</Button>
          </Grid>

          <Grid style={{ display: "flex", gap: "1rem" }}>
            <Grid item xs={7}>
              <Grid>
                <Graph variation={allpercentage} />
              </Grid>

              <Grid mt={1}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow style={{ backgroundColor: "#e9ecef" }}>
                        <TableCell style={{ color: "#000", fontWeight: 700 }}>
                          Tokens
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ color: "#000", fontWeight: 700 }}
                        >
                          Token Ratio
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ color: "#000", fontWeight: 700 }}
                        >
                          Token Price
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ color: "#000", fontWeight: 700 }}
                        >
                          % Change
                          <Typography
                            variant="caption"
                            sx={{ fontStyle: "italic" }}
                          >
                            {" "}
                            (24 hours)
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentCurrency &&
                        currentCardData?.coins.map((coin) => (
                          <TableRow
                            key={coin.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {coin.name}
                            </TableCell>
                            <TableCell align="right">{coin.value}</TableCell>
                            <TableCell align="right">
                              {currentCurrency[coin.name]} $
                            </TableCell>
                            <TableCell align="right">
                              {(
                                (currencyHistory[coin.name][
                                  currencyHistory[coin.name].length - 1
                                ][4] -
                                  currencyHistory[coin.name][0][4]) /
                                100
                              ).toFixed(4)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            <Grid item xs={5}>
              <Paper>
                <Grid alignItems={"center"} textAlign="center">
                  <Typography variant="h4" textAlign="center">
                    {"data.bundleName"}
                  </Typography>
                  <Typography variant="h5" fontWeight={100} textAlign="center">
                    {"BTC"}
                  </Typography>
                  <Typography
                    variant="h5"
                    textAlign={"center"}
                    style={{ fontWeight: "bold" }}
                    mb={2}
                  >
                    Basket Owner: {window.accountId}
                  </Typography>
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <b>Market Cap</b>
                          </TableCell>
                          <TableCell>$239</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <b>Target Leverage</b>
                          </TableCell>
                          <TableCell>25%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <b>Real Leverage</b>
                          </TableCell>
                          <TableCell>2.25%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Paper>
              <Button
                variant="contained"
                color="success"
                style={{ marginTop: "10px", height: "50px" }}
                fullWidth
                onClick={handleOpen}
              >
                Invest
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ backgroundColor: "rgb(0 0 0 / 70%)" }}
      >
        {open && (
          <Box sx={style}>
            <Typography variant="h4" align="center">
              {"😐"}
            </Typography>
            <Typography variant="h5" align="center">
              Oops! Unfortunately, Near isn't ready to supports DEX, CEX
              integration. You'll soon be able to perform investments via REF
              finance, or others. Thank you!
            </Typography>
            <Typography variant="h5" align="center" mt={2}>
              <Button
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,#4743fb -2.16%,#c750ff)",
                  color: "white",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
                endIcon={<ExploreIcon />}
                onClick={() => {
                  handleClose();
                }}
              >
                Explore our Baskets
              </Button>
            </Typography>
          </Box>
        )}
      </Modal>
    </Grid>
  );
}

function ModalTitle({ title }) {
  return (
    <Grid textAlign={"center"}>
      <Typography variant="h3" style={{ fontStyle: "bold" }}>
        {title}
      </Typography>
      <Typography variant="body1" fontWeight={100}>
        {"BTC"}
      </Typography>
    </Grid>
  );
}

export default Explore;
