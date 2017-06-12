import React, { Component } from 'react'
import './Messages.css'
import { getMessages } from './Firebase'

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
    this.getMessages()
    setInterval(() => {
      this.getMessages()
    } , 60000)
  }

  getMessages() {
    getMessages().then(messages => {
      this.setState({ messages: messages.val() })
    })
  }

  render() {
    if (!this.state.messages) return null
    return (
      <div className="Messages">
        { parseMessages(this.state.messages).map(message =>
          <p key={message.unixTimeStamp}> { message.content } </p>
        )}
      </div>
    )
  }
}

export default Messages
