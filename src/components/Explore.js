import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Graph from "./Graph";
import { async } from "regenerator-runtime";

function Explore() {
  const [data1, setData1] = useState([]);
  const [cardDataEnable, setCardDataEnable] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState([]);
  const [currencyHistory, setCurrencyHistory] = useState([]);
  const [allpercentage, setAllPercentage] = useState([]);
  const [variation, setVariation] = useState([]);
  const [currentCardData, setCurrentCardData] = useState([]);
  const [ohlcData, setOhlcData] = useState([]);
  const [eachPercentage, setEachPercentage] = useState([]);

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
            gridTemplateRows: " repeat(4, 100px)",
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
                    <Typography variant="body2">
                      Price
                      <br />
                      {'"a benevolent smile"'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
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
                          Coins
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ color: "#000", fontWeight: 700 }}
                        >
                          Coin Ratio
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ color: "#000", fontWeight: 700 }}
                        >
                          Coin Price
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
              <Paper style={{ height: "550px" }}>Hello</Paper>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default Explore;
