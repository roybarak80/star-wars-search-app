import React, { useState, useEffect } from "react";

// The following component generate a "user typing like" text.
const TypewriterText = ({ text, speed, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    // for each iteration the text should be reset into empty string to prevent concating the strings.
    setDisplayedText("");
    const interval = setInterval(() => {
      // according to the speed, each letter will display
      setDisplayedText(
        (prev) => prev + (text[index - 1] ? text[index - 1] : text[index])
      );
      index++;
      if (index === text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "1.2em",
        height: "10px",
        marginBottom: "40px",
      }}
    >
      {displayedText}
    </div>
  );
};

const SearchInstruction = () => {
  const texts = [
    "Welcome to Star Wars Characters Search app!",
    "You can search your favorite Star Wars characters",
    "MAY THE FORCE BE WITH YOU!",
    "Explore planets, ships, and more from the Star Wars universe",
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const handleComplete = () => {
    setTimeout(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 1000);
  };

  return (
    <div>
      <TypewriterText
        text={texts[currentTextIndex]}
        speed={100}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default SearchInstruction;
