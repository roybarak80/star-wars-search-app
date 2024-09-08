import React from "react";
import SearchComponent from "./../components/searchComponent/searchComponent";

const Home: React.FC = (): JSX.Element => {
  return (
    <div className="home-wrapper">
      <img
        id="local-nav-logo-mobile"
        src="https://lumiere-a.akamaihd.net/v1/images/sw_nav_logo_mobile_659fef1a_1_99c6e87c.png?region=0,0,312,32"
        alt="Local Nav | Drop-Down Phase III - 20231020"
      ></img>
      <h1>Welcome!</h1>
      <div className="search-wrapper">
        <SearchComponent />
      </div>
    </div>
  );
};

export default Home;
