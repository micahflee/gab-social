import React from 'react'
import PropTypes from 'prop-types'
import Heading from './heading'

class BlockHeading extends React.PureComponent {

  render() {
    const { title } = this.props

    return (
      <div className={[_s.d, _s.px15, _s.py10].join(' ')}>
        <div className={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
          <Heading size='h2'>{title}</Heading>
        </div>
      </div>
    )
  }

}

BlockHeading.propTypes = {
  title: PropTypes.string.isRequired,
}

export default BlockHeading