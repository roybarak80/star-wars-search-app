import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Catergory from "./pages/Catergory";

export default (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/:category" element={<Catergory />} />
  </Routes>
);
