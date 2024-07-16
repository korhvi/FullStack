import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const className = `notification ${type || 'info'}`

  return <div className={className}>{message}</div>
}

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string.isRequired,
}

export default Notification
