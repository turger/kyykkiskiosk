import React, { Component } from 'react'
import './App.css'
import Kyykkishotline from './Kyykkishotline'
import Footer from './Footer'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Kyykkishotline />
        <Footer />
      </div>
    )
  }
}

export default App
