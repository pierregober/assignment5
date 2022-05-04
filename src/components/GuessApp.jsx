import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function GuessApp() {
  const [num, setNum] = useState();
  const [guess, setGuess] = useState();
  const [message, setMessage] = useState();
  const [averages, setAverages] = useState(
    JSON.parse(window.localStorage.getItem("averages")) || [],
  );
  const [numHint, setNumHint] = useState(
    JSON.parse(window.localStorage.getItem("numHint")) || false,
  );
  const [prevGuess, setPrevGuess] = useState(1);
  const [stats, setStats] = useState(
    JSON.parse(window.localStorage.getItem("stats")) || {
      wrong: 0,
      correct: 0,
    },
  );
  const [isDisabled, setIsDisabled] = useState(
    JSON.parse(window.localStorage.getItem("isDisabled")) || false,
  );

  console.log(
    isDisabled,
    JSON.parse(window.localStorage.getItem("isDisabled")),
  );

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * 100);
    setNum(randomNum);
  }, [stats.correct]);

  function guessHandler() {
    if (Number(guess) === num) {
      setMessage("Wow you got it! Go ahead the guess the next number!");
      updater("correct");
    }
    if (guess > num) {
      setMessage("Too high!");
      updater("wrong");
    }
    if (guess < num) {
      setMessage("Too low!");
      updater("wrong");
    }
  }

  function updater(type) {
    setStats((prev) => {
      const updated = { ...prev };
      updated[type] = prev[type] + 1;
      return updated;
    });
    if (type === "wrong") {
      setPrevGuess((prev) => Number(prev) + 1);
      //If you have more than 10 wrong in a row toggle the hint button
      if (prevGuess >= 10) {
        setNumHint(true);
      }
      if (prevGuess === 15) {
        setMessage("You have lost the game! Try again!");
        setNumHint(false);
        setIsDisabled(true);
      }
    } else {
      getAverage();
      setPrevGuess(0);
      setNumHint(false);
    }
  }

  function getAverage() {
    const average = stats.wrong;
    setAverages((prev) => [...prev, average]);
  }

  function showNum() {
    setMessage("The number is " + num);
  }

  function resetHandler() {
    localStorage.clear();
    setMessage("");
    setAverages([]);
    setStats({
      wrong: 0,
      correct: 0,
    });
    setIsDisabled(false);
    setNumHint(false);
  }

  return (
    <div className="container">
      <div>
        <div className="title">React Guessing Game</div>
        <input
          disabled={isDisabled}
          className="guessInput"
          type="number"
          onChange={(e) => setGuess(Number(e.target.value))}
        />
        <button onClick={guessHandler}>Submit Guess</button>
      </div>
      <div className="message">
        {message
          ? message
          : "Make a guess of a number between 1 and 100. You have a total of 15 guesses to get it right!"}
      </div>
      <div className="buttonContainer">
        <Link
          to="/profile"
          state={{ stats: stats, averages: averages, isDisabled: isDisabled }}
        >
          <button>Go to Profile Stats</button>
        </Link>
        {isDisabled && <button onClick={resetHandler}>Reset Game</button>}
        {numHint && <button onClick={showNum}>Debug</button>}
      </div>
    </div>
  );
}
export default GuessApp;
