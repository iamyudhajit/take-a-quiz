import React from 'react'
import Options from './Options';

const Question = ({question}) => {
  return (
    <>
      <h4>{question.question}</h4>
      <Options question={question}/>
    </>
  );
}

export default Question