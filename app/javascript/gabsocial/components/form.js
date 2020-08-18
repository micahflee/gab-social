import React from 'react'
import PropTypes from 'prop-types'
import Text from './text'

class Form extends React.PureComponent {

  render() {
    const {
      children,
      errorMessage,
      onSubmit,
    } = this.props

    return (
      <form onSubmit={onSubmit} className={_s.d}>
        {
          !!errorMessage &&
          <Text color='danger' className={_s.my10}>
            {errorMessage}
          </Text>
        }
        <div className={_s.d}>
          {children}
        </div>
      </form>
    )
  }

}

Form.propTypes = {
  children: PropTypes.any,
  errorMessage: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
}

export default Form