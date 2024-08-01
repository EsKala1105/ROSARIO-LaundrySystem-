import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetUser } from "../states/user";
import { Notify } from "../../utils/notify/Notify";
import { messageGeneral } from "../states/negocio";

export const GetInfoUser = createAsyncThunk(
  "user/GetInfoUser",
  async (headers, { dispatch }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-user`,
        headers
      );
      return response.data;
    } catch (error) {
      // Manejar errores aquí
      if (error.response.status === 500) {
        Notify("Error de Sistema", error.response.data.mensaje, "fail");
      } else {
        if (error.response.status === 403) {
          if (error.response.data.type === "outTime") {
            await dispatch(
              messageGeneral({
                title: "Comunicado",
                message: error.response.data.mensaje,
                ico: "time-out",
              })
            );
          } else if (error.response.data.type === "locking") {
            await dispatch(
              messageGeneral({
                title: "Comunicado",
                message: error.response.data.mensaje,
                ico: "close-emergency",
              })
            );
          } else {
            Notify("Error", error.response.data.mensaje, "fail");
          }
        }
        dispatch(resetUser());
      }
    }
  }
);
