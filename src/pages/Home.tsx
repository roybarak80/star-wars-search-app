import React from "react";
import SearchComponent from "./../components/searchComponent/searchComponent";

import SearchInstruction from "@/components/TypewriterText";

const Home: React.FC = (): JSX.Element => {
  return (
    <div className="home-wrapper">
      <div className="home-logo">
      </div>
            <SearchInstruction />

      <div className="search-wrapper">
        <SearchComponent />
      </div>
    </div>
  );
};

export default Home;
