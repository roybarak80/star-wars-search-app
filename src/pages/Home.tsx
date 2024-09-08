import React from "react";
import SearchComponent from "./../components/searchComponent/searchComponent";

const Home: React.FC = (): JSX.Element => {
  return (
    <div className="home-wrapper">
      <div className="home-logo">
      </div>
      <div className="search-wrapper">
        <SearchComponent />
      </div>
    </div>
  );
};

export default Home;
