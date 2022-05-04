import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Profile() {
  let { state } = useLocation();

  const [message, setMessage] = useState("");
  const [avg, setAvg] = useState(
    window.localStorage.getItem(
      "averages",
      JSON.stringify(state.averages) || [],
    ),
  );

  useEffect(() => {
    if (state.stats.correct > state.stats.wrong) {
      setMessage("You are a genius!");
    }
    if (state.stats.correct < state.stats.wrong) {
      setMessage("Get better at guessing!");
    }
    if (state.stats.correct === 0 && state.stats.wrong === 0) {
      setMessage("You have not played yet! Go back and guess!");
    }
    if (state.averages.length) {
      setAvg(state.averages.reduce((a, b) => a + b) / state.averages.length);
    }
    window.localStorage.setItem("averages", JSON.stringify(state.averages));
    window.localStorage.setItem("stats", JSON.stringify(state.stats));
    window.localStorage.setItem("isDisabled", JSON.stringify(state.isDisabled));
    if (state.isDisabled) {
      window.localStorage.setItem("numHint", JSON.stringify(false));
    }
  }, [state]);

  function getAcc() {
    return (
      Math.floor(
        (state.stats.correct / (state.stats.correct + state.stats.wrong)) * 100,
      ) + "%"
    );
  }

  return (
    <div className="container">
      <div className="statContainer">
        <div className="statMessage">{message}</div>
        <div>
          <div>
            <b>Correct: </b>
            {state.stats.correct}
          </div>
          <div>
            <b>Wrong: </b>
            {state.stats.wrong}
          </div>
          <div>
            <b> Average # of Guesses Needed:</b>{" "}
            {state.averages.length ? avg : "You haven't won yet!"}
          </div>
          <div>
            <b>Overall Accuracy:</b>{" "}
            {state.averages.length
              ? getAcc()
              : "0% because You haven't won yet!"}
          </div>
        </div>
      </div>

      <Link to="/">
        <button>Go back to the Guess App </button>
      </Link>
    </div>
  );
}
export default Profile;
