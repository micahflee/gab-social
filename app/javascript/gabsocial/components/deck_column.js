import React from 'react'
import PropTypes from 'prop-types'
import DeckColumnHeader from './deck_column_header'

class DeckColumn extends React.PureComponent {

  render() {
    const {
      title,
      subtitle,
      icon,
      children,
      index,
      noButtons,
    } = this.props

    return (
      <div className={[_s.d, _s.w360PX, _s.px2, _s.bgSecondary, _s.h100VH].join(' ')}>
        <div className={[_s.d, _s.w100PC, _s.bgPrimary, _s.h100VH].join(' ')}>
          <DeckColumnHeader
            title={title}
            subtitle={subtitle}
            icon={icon}
            index={index}
            noButtons={noButtons}
          />
          <div className={[_s.d, _s.w100PC, _s.overflowYScroll, _s.boxShadowNone, _s.posAbs, _s.top60PX, _s.left0, _s.right0, _s.bottom0].join(' ')}>
            {children}
          </div>
        </div>
      </div>
    )
  }

}

DeckColumn.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  index: PropTypes.number,
  noButtons: PropTypes.bool,
}

export default DeckColumn