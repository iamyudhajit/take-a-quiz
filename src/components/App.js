import React, { useEffect, useReducer } from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Question from "./Question.js";
import NextButton from "./NextButton.js";
import Progress from "./Progress.js";
import FinishedScreen from "./FinishedScreen.js";

const initialState = {
  questions: [],
  status: "", //loading , error , ready , active , finished
  index : 0,
  answer : null,
  points : 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer" : 
      const question = state.questions.at(state.index);
      return {...state , answer : action.payload , points : action.payload === question.correctOption ? state.points + question.points : state.points}
    case "nextQuestion" : 
      return {...state , index : state.index+1,  answer : null};
    case "finished" :
      return {...state , status : "finished"}
    case "restart" : 
      return {...initialState , questions : state.questions , status : "ready"}
    default:
      throw new Error("Action Unknown");
  }
}

function App() {
  const [{ questions, status , index , answer , points}, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev,cur) => prev + cur.points , 0);

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="App">
      <div className="app">
        <Header />
        <Main>
          {status === "loading" && <Loader />}
          {status === "error" && <Error />}
          {status === "ready" && (
            <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
          )}
          {status === "active" && (
            <>
            <Progress index={index} numQuestions={numQuestions} points = {points} maxPossiblePoints={maxPossiblePoints} answer = {answer}/>
              <Question
                question={questions[index]}
                answer={answer}
                dispatch={dispatch}
              />{" "}
              <NextButton dispatch={dispatch} answer = {answer} index = {index} numQuestions={numQuestions}/>
            </>
          )}
          {status==='finished' && <FinishedScreen points={points} maxPossiblePoints={maxPossiblePoints} dispatch={dispatch}/>}
        </Main>
      </div>
    </div>
  );
}

export default App;
