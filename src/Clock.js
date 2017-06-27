import React, { Component } from 'react'
import "./Clock.css"

class Clock extends Component {

  render() {
    return (
      <div className="Clock">
        {this.props.dateTime}
      </div>
    )
  }

}

export default Clock