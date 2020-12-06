import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash.isequal'
import { APP_NAME } from '../../../constants'

class PageTitle extends React.PureComponent {

  componentDidMount() {
    this.updatePageTitle(this.props) 
  }

  componentDidUpdate(prevProps) {
    if (this.props.badge !== prevProps.badge || !isEqual(this.props.path, prevProps.path)) {
      this.updatePageTitle(this.props)
    }
  }

  updatePageTitle = ({ badge, path}) => {
    let realPath = Array.isArray(path) ? path.join(' / ') : `${path}`
    realPath = realPath.trim()

    const realBadge = !!badge ? `(${badge})` : ''

    const title = `${realBadge} ${realPath} / ${APP_NAME}`.trim()

    document.title = title
  }

  render() {
    return null
  }

}

PageTitle.propTypes = {
  badge: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
}

export default PageTitle