import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRoute from "./routes/AppRoute";

import "dayjs/locale/es";
import moment from "moment";
import "moment/dist/locale/es";
import "moment-timezone";
import "moment-timezone/builds/moment-timezone-with-data";
import { timeZone } from "./services/global";

import { MantineProvider } from "@mantine/core";

moment.tz.setDefault(timeZone);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider>
      <AppRoute />
    </MantineProvider>
    <div id="portal-root" />
  </React.StrictMode>
);
