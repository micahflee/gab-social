import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { deleteDeckColumnAtIndex } from '../actions/deck'
import Icon from './icon'
import Text from './text'
import Button from './button'

class DeckColumnHeader extends React.PureComponent {

  handleClickDelete = () => {
    this.props.dispatch(deleteDeckColumnAtIndex(this.props.index))
  }

  handleClickRefresh = () => {
    const { onRefresh } = this.props
    if (!!onRefresh) onRefresh()
  }

  render() {
    const {
      title,
      subtitle,
      icon,
      children,
      noButtons,
      noRefresh,
    } = this.props

    return (
      <div data-sort-header className={[_s.d, _s.w100PC, _s.overflowHidden, _s.flexRow, _s.aiCenter, _s.h60PX, _s.px15, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary, _s.bgPrimary].join(' ')}>
        <div data-sort-header className={[_s.d, _s.flexRow, _s.mr15, _s.cursorEWResize].join(' ')}>
          <span className={[_s.d, _s.w1PX, _s.h24PX, _s.mr2, _s.bgSecondary].join(' ')} />
          <span className={[_s.d, _s.w1PX, _s.h24PX, _s.mr2, _s.bgSecondary].join(' ')} />
          <span className={[_s.d, _s.w1PX, _s.h24PX, _s.bgSecondary].join(' ')} />
        </div>

        { !!icon && <Icon id={icon} className={[_s.cPrimary, _s.mr15].join(' ')} size='18px' /> }
        <div className={[_s.d, _s.flexRow, _s.aiEnd, _s.flexShrink1, _s.overflowHidden, _s.textOverflowEllipsis2].join(' ')}>
          { !!title && <Text size='extraLarge' weight='medium'>{title}</Text> }
          { !!subtitle && <Text className={_s.ml5} color='secondary'>{subtitle}</Text> }
        </div>
        {
          !!title && !noButtons &&
          <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.mlAuto, _s.jcCenter].join(' ')}>
            {
              !noRefresh &&
              <Button
                isNarrow
                noClasses
                onClick={this.handleClickRefresh}
                className={[_s.d, _s.mr5, _s.cursorPointer, _s.outlineNone, _s.bgTransparent, _s.px5, _s.py5].join(' ')}
                iconClassName={_s.cSecondary}
                icon='repost'
              />
            }
            <Button
              isNarrow
              noClasses
              onClick={this.handleClickDelete}
              className={[_s.d, _s.mr5, _s.cursorPointer, _s.outlineNone, _s.bgTransparent, _s.px5, _s.py5].join(' ')}
              iconClassName={_s.cSecondary}
              icon='trash'
            />
          </div>
        }
      </div>
    )
  }

}

DeckColumnHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  index: PropTypes.number,
  noButtons: PropTypes.bool,
  noRefresh: PropTypes.bool,
  onRefresh: PropTypes.func,
}

export default connect()(DeckColumnHeader)