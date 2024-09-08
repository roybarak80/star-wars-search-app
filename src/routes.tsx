import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import People from "./pages/People";

export default (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/people" element={<People />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
