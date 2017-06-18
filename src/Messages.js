import React, { Component } from 'react'
import './Messages.css'
import { pollMessages, stopPollMessages } from './services/firebase'

const parseMessages = messages => {
  return Object.keys(messages)
    .reduce((messagesArr, key) => {
      messagesArr.push(messages[key])
      return messagesArr
    }, [])
  }

class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: undefined,
    }
  }

  componentDidMount() {
    pollMessages(messages => {
      this.setState({ messages })
    })
  }

  componentWillUnmount() {
    stopPollMessages()
  }

  updateBodyBackground(url) {
    const body = document.body
    body.style.backgroundImage = url ? `url(${url})` : ''
  }

  render() {
    if (!this.state.messages) return null
    return (
      <div className="Messages">
        { parseMessages(this.state.messages).map(message => {
          this.updateBodyBackground(message.image)
          return (
            <div className="Messages__message" key={message.id}>
              <div className="Messages__emojis">
                { message.emojis.map((emoji, i) => (
                  <img alt="" src={emoji} key={i} />
                )) }
              </div>
              <p>{ message.content }</p>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Messages
