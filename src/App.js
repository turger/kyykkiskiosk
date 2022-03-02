import React from 'react'
import './App.css'
import Stops from './Stops'
import Weather from './Weather'
import DateTime from './DateTime'

const App = () => (
  <div className="App" >
    <div className="App__top">
      <DateTime/>
      {/*<Bikes/>*/}
    </div>
    <Stops/>
    <Weather/>
  </div>
)

export default App
