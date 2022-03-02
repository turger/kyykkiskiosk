import React from 'react'
import PropTypes from 'prop-types'
import {emojify} from 'react-emojione';

const Emoji = ({name}) => <div className="Emoji">{emojify(name, {style: {height: 18}})}</div>

Emoji.propTypes = {name: PropTypes.string.isRequired}

export default Emoji
