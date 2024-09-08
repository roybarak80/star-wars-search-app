import React from "react";

import Layout from "@/components/Layout";
import routes from "@/routes";
import {  ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from '@/styles/theme/theme'; 

const App = (): JSX.Element => {
  return <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Layout>{routes}</Layout>
    </ThemeProvider>;
};

export default App;
