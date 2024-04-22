import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Questions from "./Questions";
const initialState = {
  questions: [],

  // 'Loading', 'error', 'ready', 'active', 'finished',
  status: "Loading",
  index: 0,
  answer: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "DataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "DataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      return {
        ...state,
        answer: action.payload,
      };

    default:
      throw new Error("Action Unkown");
  }
}

export default function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((Data) => dispatch({ type: "DataReceived", payload: Data }))
      .catch((err) => dispatch({ type: "DataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "Loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <Questions
            questions={questions[index]}
            dispatch={dispatch}
            amswer={answer}
          />
        )}
      </Main>
    </div>
  );
}
