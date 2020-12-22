import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { openModal } from '../actions/modal'
import {
  CX,
  MODAL_ALBUM_CREATE,
} from '../constants'
import Button from './button'
import Icon from './icon'
import Image from './image'
import Text from './text'

class Album extends React.PureComponent {

  handleOnOpenAlbumCreate = () => {
    this.props.openAlbumCreate()
  }

  render() {
    const {
      account,
      album,
      isAddable,
    } = this.props

    if (!isAddable && (!album || !account)) return null

    const title = isAddable ? 'New album' : album.get('title')
    const subtitle = isAddable ? '' : `${album.get('count')} Items`
    const to = isAddable ? undefined : `/${account.get('username')}/albums/${album.get('id')}`
    const albumImageUrl = !!album ? album.getIn(['cover', 'preview_url'], null) : null

    return (
      <div className={[_s.d, _s.minW162PX, _s.px5, _s.flex1].join(' ')}>
        <Button
          noClasses
          className={[_s.d, _s.noUnderline, _s.cursorPointer, _s.outlineNone, _s.bgTransparent].join(' ')}
          to={to}
          onClick={isAddable ? this.handleOnOpenAlbumCreate : undefined}
        >
          <div className={[_s.d, _s.w100PC, _s.mt5, _s.mb10].join(' ')}>
            <div className={[_s.d, _s.w100PC, _s.pt100PC].join(' ')}>
              <div className={[_s.d, _s.posAbs, _s.top0, _s.w100PC, _s.right0, _s.bottom0, _s.left0].join(' ')}>
                <div className={[_s.d, _s.w100PC, _s.h100PC, _s.aiCenter, _s.jcCenter, _s.radiusSmall, _s.overflowHidden, _s.bgTertiary, _s.border1PX, _s.borderColorSecondary].join(' ')}>
                  { isAddable && <Icon id='add' size='20px' /> }
                  {
                    albumImageUrl &&
                    <Image
                      height='100%'
                      width='100%'
                      className={_s.z3}
                      src={albumImageUrl}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
          <div className={[_s.d, _s.w100PC, _s.pt7, _s.mb15].join(' ')}>
            <Text weight='bold'>{title}</Text>
            { !isAddable && <Text color='secondary' size='small' className={_s.mt5}>{subtitle}</Text> }
          </div>
        </Button>
      </div>
    )
  }

}

Album.propTypes = {
  account: ImmutablePropTypes.map,
  album: ImmutablePropTypes.map,
  isAddable: PropTypes.bool,
}

const mapStateToProps = (state, { albumId }) => ({
  album: state.getIn(['albums', albumId]),
})

const mapDispatchToProps = (dispatch) => ({
  openAlbumCreate() {
    dispatch(openModal(MODAL_ALBUM_CREATE))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Album)