import React, { Component, PropTypes } from 'react'
import emojione from 'emojione'

class Emoji extends Component {
  componentWillReceiveProps(nextProps) {
    if (this._dom) {
      this._dom.innerHTML = emojione.shortnameToImage(nextProps.name)
    }
  }

  componentWillUnmount() {
    this._dom.innerHTML = ''
    this._dom = null
  }

  componentDidMount() {
    this._dom.innerHTML = emojione.shortnameToImage(this.props.name)
  }

  render() {
    return <div ref={dom => this._dom = dom} />
  }
}

Emoji.propTypes = {
  name: PropTypes.string.isRequired,
}

export default Emoji
