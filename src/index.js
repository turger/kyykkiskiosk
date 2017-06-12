import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { firebaseInit } from './Firebase'
import './index.css'

firebaseInit()

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
