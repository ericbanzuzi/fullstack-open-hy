import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({text, value}) => {
  return (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
  )
}


const Statistics = ({ good, neutral, bad }) => {

  let sum = good + neutral + bad
  if (sum === 0) {
    return (
    <div>
      <Header text="statistics" />
      No feedback given
    </div>
    )
  }

  const computeAverage = () => (good + -1*bad)/(sum)
  const computePercentagePositive = () => 100*good/(sum)

  return (
  <div>
    <Header text="statistics" />
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value ={neutral}/>
        <StatisticLine text="bad"  value={bad}/>
        <StatisticLine text="all"  value={sum}/>
        <StatisticLine text="average" value={computeAverage()}/>
        <StatisticLine text="positive" value={computePercentagePositive() + "%"}/>
      </tbody>
    </table>
  </div>
  )
} 


const App = () => {
  // Save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const updateValue = (value, setValue) => {
    const newValue = value + 1
    setValue(newValue);
  }

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={() => updateValue(good, setGood)} text="good" />
      <Button handleClick={() => updateValue(neutral, setNeutral)} text="neutral" />
      <Button handleClick={() => updateValue(bad, setBad)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
