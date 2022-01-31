import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Graph from "./Graph";

let array = [];
let graphArray = [];
let dataArray = [];

function Explore() {
  const [data, setData] = useState([]);
  const [cardDataEnable, setCardDataEnable] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState([]);
  const [currencyHistory, setCurrencyHistory] = useState([]);
  const [allpercentage, setAllPercentage] = useState([]);
  const [variation, setVariation] = useState([]);

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
  };

  useEffect(() => {
    const prices = {};
    const ohlcData = {};
    axios
      .post("http://localhost:3000/view_nft", {
        token_id: "cryptoIndex",
        contract: "qwert1.testnet",
      })
      .then(({ data }) => {
        JSON.parse(data.metadata).coins.map((coin, index) => {
          axios
            .get(
              `https://api.coingecko.com/api/v3/simple/price?ids=${coin.name}&vs_currencies=usd`
            )
            .then((res) => {
              prices[coin.name] = res.data[coin.name.toLowerCase()].usd;
            });
          axios
            .get(
              `https://api.coingecko.com/api/v3/coins/${coin.name.toLowerCase()}/ohlc?vs_currency=usd&days=7`
            )
            .then((ohlc) => {
              ohlcData[coin.name] = ohlc.data;
              array.push(calculateEachPercentage(ohlc.data));
            })
            .then(() => {
              calculateAllSum(...array);
            });
        });
        setData(JSON.parse(data.metadata));
      });
    setCurrentCurrency(prices);
    setCurrencyHistory(ohlcData);
  }, []);

  const handleCardClick = () => {
    setCardDataEnable(true);
    let data1 = variation.map((item) => {
      return { growth: Number((item / data?.coins?.length).toFixed(4)) };
    });
    setAllPercentage(data1);
  };

  return (
    <Grid mt={10} mb={40}>
      {cardDataEnable && (
        <Grid>
          <Grid>
            <Button onClick={() => setCardDataEnable(false)}>Back</Button>
          </Grid>
          <Graph variation={allpercentage} />
        </Grid>
      )}
      {!cardDataEnable && (
        <Card
          sx={{ maxWidth: 320 }}
          onClick={() => handleCardClick()}
          style={{ cursor: "pointer" }}
        >
          <CardContent>
            {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Word of the Day
          </Typography> */}
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
      )}
      {cardDataEnable && (
        <Grid>
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
                    <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                      {" "}
                      (24 hours)
                    </Typography>
                  </TableCell>
                  {/* <TableCell
                    align="right"
                    style={{ color: "#000", fontWeight: 700 }}
                  >
                    
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  currentCurrency &&
                  data?.coins.map((coin) => (
                    <TableRow
                      key={coin.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
      )}
    </Grid>
  );
}

export default Explore;
