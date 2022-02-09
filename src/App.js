import "regenerator-runtime/runtime";
import React from "react";
// import "./global.css";
import Home from "./components/Home";
import {
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import Explore from "./components/Explore";
import Create from "./components/Create";
import { login, logout } from "./utils";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import image from "./assets/Untitled.png";
import image1 from "./assets/Saly.png";

export default function App() {
  let navigate = useNavigate();
  let location = useLocation();

  const style = {
    display: "flex",
    justifyContent: "space-around",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 400,
    width: 900,
    border: "none",
    boxShadow: 12,
    backgroundColor: "#fdfcf7",
    p: 4,
    textAlign: "center",
    borderRadius: 6,
    alignItems: "flex-start",
  };

  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <Grid sx={style}>
          <Grid>
            <img src={image1} height={320} />
          </Grid>
          <Box>
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
                  backgroundColor: "#E07A5F",
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
        </Grid>
      </main>
    );
  }

  return (
    <Grid>
      {window.walletConnection.isSignedIn() && (
        <Grid
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px",
            borderBottom: "1px solid #F2CC8F",
            paddingLeft: "150px",
            paddingRight: "100px",
            alignItems: "center",
          }}
        >
          <Grid>
            <img src={image} height={46} />
          </Grid>
          <Grid>
            <Button
              style={{
                backgroundColor: `${
                  location.pathname === "/" ? "#E07A5F" : "transparent"
                }`,
                padding: "10px",
                borderRadius: "8px",
                margin: "0px 12px",
              }}
            >
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: `${location.pathname === "/" ? "#fff" : "#000"}`,
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                Home
              </Link>
            </Button>
            <Button
              style={{
                backgroundColor: `${
                  location.pathname === "/create" ? "#E07A5F" : "transparent"
                }`,
                padding: "10px",
                borderRadius: "8px",
                margin: "0px 12px",
              }}
            >
              <Link
                to="create"
                style={{
                  textDecoration: "none",
                  color: `${location.pathname === "/create" ? "#fff" : "#000"}`,
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                Create
              </Link>
            </Button>
            <Button
              style={{
                backgroundColor: `${
                  location.pathname === "/explore" ? "#E07A5F" : "transparent"
                }`,
                padding: "10px",
                borderRadius: "8px",
                margin: "0px 12px",
              }}
            >
              <Link
                to="explore"
                style={{
                  textDecoration: "none",
                  color: `${
                    location.pathname === "/explore" ? "#fff" : "#000"
                  }`,
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                Explore
              </Link>
            </Button>
            <Button
              className="link"
              onClick={logout}
              color="error"
              style={{
                textDecoration: "none",

                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              Sign out
            </Button>
          </Grid>
        </Grid>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="create" element={<Create />} />
      </Routes>
    </Grid>
  );
}
