/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import List from "./List/List";
import Add from "./Add/Add";

const Preliminar = () => {
  const [mode, setMode] = useState("List");

  return (
    <div>
      {/* {mode ? <LoaderSpiner /> : null} */}
      {mode === "Add" ? <Add setMode={setMode} /> : <List setMode={setMode} />}
    </div>
  );
};

export default Preliminar;
