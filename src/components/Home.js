import "regenerator-runtime/runtime";
import React from "react";
import { login, logout } from "../utils";
import "../global.css";
import image from "../assets/homeimage.png";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ExploreIcon from "@mui/icons-material/Explore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";

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

const HomeButtonStyle = {
  fontSize: "32px",
  marginLeft: 40,
  backgroundImage: "linear-gradient(90deg,#4743fb -2.16%,#c750ff)",
  color: "white",
  borderRadius: "100px",
  padding: "25px",
  minWidth: "300px",
  fontWeight: "bold",
};

export default function Home() {
  let navigate = useNavigate();

  console.log(location);

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
    <Grid style={{ overflow: "hidden" }}>
      <Grid display={"flex"}>
        <Grid width={"1000px"}>
          <img src={image} />
        </Grid>
        <Container maxWidth="md">
          <Grid mt={24} textAlign={"center"}>
            <Typography
              variant="h1"
              style={{ fontWeight: "700", color: "#3D405B", fontSize: "90px" }}
            >
              Asset management for a{" "}
              <span
                style={{
                  background:
                    "-webkit-linear-gradient(90deg,#4743fb -2.16%,#c750ff)",
                  webkitBackgroundClip: "text",
                  webkitTextFillColor: "transparent",
                  backgroundImage:
                    "linear-gradient(90deg,#E07A5F -2.16%,#F2CC8F)",
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
                color: "#b23850",
                opacity: 0.5,
              }}
            >
              Build, Invest and Monitize your Portfolio
              {/* Bring your crypto strategies to life with Set’s leading portfolio
              management tools. */}
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
                fontWeight: "bold",
              }}
              endIcon={<AddCircleIcon style={{ fontSize: "36px" }} />}
              onClick={() => {
                navigate("/create");
              }}
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
                fontWeight: "bold",
              }}
              endIcon={<ExploreIcon style={{ fontSize: "36px" }} />}
              onClick={() => {
                navigate("/explore");
              }}
            >
              Explore
            </Button>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
}

// function ModalTitle({ title }) {
//   return (
//     <Grid textAlign={"center"} mt={2}>
//       <Typography variant="h3" style={{ fontStyle: "bold" }}>
//         {title}
//       </Typography>
//     </Grid>
//   );
// }

// function Logo() {
//   return (
//     <Grid style={{ width: "200px", height: "300px" }}>
//       <video width="400px" height="300px">
//         <source src="assets/logo.mp4" type="video/mp4" />
//       </video>
//     </Grid>
//   );
// }

// this component gets rendered by App after the form is submitted
// function Notification() {
//   const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
//   return (
//     <aside>
//       <a
//         target="_blank"
//         rel="noreferrer"
//         href={`${urlPrefix}/${window.accountId}`}
//       >
//         {window.accountId}
//       </a>
//       {
//         " " /*  trims whitespace around tags; insert literal space character when needed */
//       }
//       called method: 'setGreeting' in contract:{" "}
//       <a
//         target="_blank"
//         rel="noreferrer"
//         href={`${urlPrefix}/${window.contract.contractId}`}
//       >
//         {window.contract.contractId}
//       </a>
//       <footer>
//         <div>✔ Succeeded</div>
//         <div>Just now</div>
//       </footer>
//     </aside>
//   );
// }
