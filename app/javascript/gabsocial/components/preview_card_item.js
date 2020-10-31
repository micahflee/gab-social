import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { fetchLinkCard } from '../actions/links'
import { CX } from '../constants'
import {
  decodeIDNA,
  getHostname,
  trim,
} from '../utils/urls'
import DotTextSeperator from './dot_text_seperator'
import Text from './text'
import Button from './button'
import Image from './image'
import RelativeTimestamp from './relative_timestamp'

class PreviewCardItem extends ImmutablePureComponent {

  componentDidMount() {
    const { id, card } = this.props
    if (!!id && !card) {
      this.props.dispatch(fetchLinkCard(id))
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id && !this.props.card) {
      this.props.dispatch(fetchLinkCard(this.props.id))
    }
  }

  render() {
    const { id, card } = this.props

    if (!card) return null

    const title = card.get('title')
    const maxDescription = 120
    const description = trim(card.get('description') || '', maxDescription)
    const image = card.get('image')
    const website = card.get('url')
    const provider = card.get('provider_name').length === 0 ? decodeIDNA(getHostname(card.get('url'))) : card.get('provider_name')

    return (
      <Button
        noClasses
        to={`/links/${id}`}
        className={[_s.d, _s.px10, _s.mb10, _s.noUnderline].join(' ')}
      >
        <div className={[_s.d, _s.w100PC, _s.flexRow, _s.px15, _s.py15, _s.boxShadowBlock, _s.bgPrimary, _s.overflowHidden, _s.radiusSmall, _s.bgSubtle_onHover].join(' ')}>
          {
            !!image &&
            <Image
              width='110px'
              height='110px'
              alt={'title'}
              src={image}
              className={[_s.radiusSmall, _s.overflowHidden, _s.mr10].join(' ')}
            />
          }

          <div className={[_s.d, _s.flexNormal].join(' ')}>
            <div className={_s.d}>
              <Text size='medium' color='primary' weight='bold'>
                {title}
              </Text>
            </div>

            <div className={[_s.d, _s.maxH40PX, _s.overflowHidden, _s.pt5, _s.mb5].join(' ')}>
              <Text size='small' color='secondary'>
                {description}
              </Text>
            </div>

            <Text size='small' color='secondary'>
              {provider}
            </Text>
            
            <div className={[_s.d, _s.flexRow, _s.pt5].join(' ')}>
              <Text color='secondary' size='small'>
                <RelativeTimestamp timestamp={new Date('10-20-2020')} />
              </Text>
            </div>
          </div>
        </div>
      </Button>
    )
  }

}

const mapStateToProps = (state, { id }) => ({
  card: state.getIn(['links', 'items', `${id}`]),
  isLoading: state.getIn(['links', 'isLoading']),
  isError: state.getIn(['links', 'isError']),
})

PreviewCardItem.propTypes = {
  card: ImmutablePropTypes.map,
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(PreviewCardItem)