import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

function Graph(props) {
  console.log(props);
  return (
    <Grid style={{ backgroundColor: "rgba(255,255,255, 0.7)", color: "#000" }}>
      <LineChart
        width={800}
        height={400}
        data={props.variation}
        margin={{ top: 5, left: 40, bottom: 5 }}
      >
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="growth"
          stroke="#000"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </Grid>
  );
}

export default Graph;
