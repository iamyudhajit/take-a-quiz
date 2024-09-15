import React from 'react'

const FinishedScreen = ({points , maxPossiblePoints , dispatch}) => {
    const percentage = (points / maxPossiblePoints) *100;
  return (
    <>
      <p className="result">
        You scored <strong>{points}</strong> out of {maxPossiblePoints} (
        {Math.ceil(percentage)}%)
      </p>
      <button onClick={()=>dispatch({type : "restart"})} className='btn btn-ui'>Restart Quiz</button>
    </>
  );
}

export default FinishedScreen