import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import {
  CX,
  DEFAULT_REL,
} from '../constants'
import {
  decodeIDNA,
  getHostname,
  trim,
} from '../utils/urls'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'
import Icon from './icon'
import Button from './button'
import Text from './text'

const domParser = new DOMParser()

const addAutoPlay = html => {
  const document = domParser.parseFromString(html, 'text/html').documentElement
  const iframe = document.querySelector('iframe')

  if (iframe) {
    if (iframe.src.indexOf('?') !== -1) {
      iframe.src += '&'
    } else {
      iframe.src += '?'
    }

    iframe.src += 'autoplay=1&auto_play=1'

    // DOM parser creates html/body elements around original HTML fragment,
    // so we need to get innerHTML out of the body and not the entire document
    return document.querySelector('body').innerHTML
  }

  return html
}

class StatusCard extends ImmutablePureComponent {

  state = {
    width: this.props.defaultWidth || 280,
    embedded: false,
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.card, nextProps.card)) {
      this.setState({ embedded: false })
    }
  }

  handlePhotoClick = () => {
    const { card, onOpenMedia } = this.props

    onOpenMedia(
      Immutable.fromJS([
        {
          type: 'image',
          url: card.get('embed_url'),
          description: card.get('title'),
          meta: {
            original: {
              width: card.get('width'),
              height: card.get('height'),
            },
          },
        },
      ]),
      0
    )
  }

  handleEmbedClick = () => {
    const { card } = this.props

    if (card.get('type') === 'photo') {
      this.handlePhotoClick()
    } else {
      this.setState({ embedded: true })
    }
  }

  setRef = c => {
    if (c) {
      if (this.props.cacheWidth) this.props.cacheWidth(c.offsetWidth)
      this.setState({ width: c.offsetWidth })
    }
  }

  renderVideo() {
    const { card } = this.props
    const content = { __html: addAutoPlay(card.get('html')) }
    const { width } = this.state
    const ratio = card.get('width') / card.get('height')
    const height = width / ratio

    return (
      <div
        ref={this.setRef}
        className={[_s.d, _s.bgTertiary, _s.posAbs, _s.top0, _s.right0, _s.bottom0, _s.left0, _s.statusCardVideo].join(' ')}
        dangerouslySetInnerHTML={content}
      />
    )
  }

  render() {
    const {
      card,
      isReduced,
      isVertical,
    } = this.props
    const { width, embedded } = this.state

    if (card === null) return null

    const maxDescription = 160
    const cardImg = card.get('image')
    const provider = card.get('provider_name').length === 0 ? decodeIDNA(getHostname(card.get('url'))) : card.get('provider_name')
    const interactive = card.get('type') !== 'link'
    const isOnLinkFeed = `${window.location.pathname}`.indexOf('/links/') > -1

    const imgContainerClasses = CX({
      d: 1,
      h220PX: 1,
      w330PX: !isVertical,
    })

    const cardTitle = `${card.get('title')}`.trim()
    const title = interactive ?
      (
        <a
          className={[_s.d, _s.displayFlex, _s.text, _s.noUnderline, _s.overflowWrapBreakWord, _s.cPrimary, _s.fs15PX, _s.fw500].join(' ')}
          href={card.get('url')}
          title={cardTitle}
          rel={DEFAULT_REL}
          target='_blank'
        >
          {cardTitle}
        </a>
      )
      : (
        <span className={[_s.d, _s.displayFlex, _s.text, _s.overflowWrapBreakWord, _s.cPrimary, _s.fs15PX, _s.fw500].join(' ')}>
          {cardTitle}
        </span>
      )

    const description = (
      <div className={[_s.d, _s.flexNormal, _s.px10, _s.py10, _s.overflowHidden, _s.borderColorSecondary, _s.borderLeft1PX].join(' ')}>
        {title}
        <p className={[_s.d, _s.displayFlex, _s.text, _s.mt5, _s.mb5, _s.overflowWrapBreakWord, _s.cSecondary, _s.fs13PX, _s.fw400].join(' ')}>
          {trim(card.get('description') || '', maxDescription)}
        </p>
        <span className={[_s.d, _s.mtAuto, _s.flexRow, _s.flexWrap, _s.aiCenter, _s.displayFlex, _s.textOverflowEllipsis].join(' ')}>
          <Icon id='link' size='10px' className={[_s.cSecondary, _s.mr5].join(' ')} fixedWidth />
          <Text color='secondary' size='small' className={[_s.mrAuto, _s.whiteSpaceNoWrap, _s.overflowHidden, _s.maxW100PC130PX, _s.textOverflowEllipsis2].join(' ')}>
            {provider}
          </Text>
          {
            !isOnLinkFeed &&
            <Button
              isNarrow
              color='secondary'
              backgroundColor='secondary'
              to={`/links/${card.get('id')}`}
              className={_s.px10}
            >
              <Text color='inherit' size='extraSmall'>View Link Feed</Text>
            </Button>
          }
        </span>
      </div>
    )

    // : todo : use <Image />
    let embed = ''
    const thumbnail = interactive ?
      <img loading='lazy' alt={''} src={cardImg} className={[_s.d, _s.objectFitCover, _s.posAbs, _s.w100PC, _s.h100PC, _s.top0, _s.right0, _s.bottom0, _s.left0].join(' ')} />
      :
      (
        <ResponsiveClassesComponent
          classNames={imgContainerClasses}
          classNamesSmall={[_s.d, _s.h260PX, _s.w100PC].join(' ')}
          classNamesXS={[_s.d, _s.h200PX, _s.w100PC].join(' ')}
        >
          <img loading='lazy' alt={''} src={cardImg} className={[_s.d, _s.objectFitCover, _s.w100PC, _s.h100PC].join(' ')} />
        </ResponsiveClassesComponent>
      )

    if (interactive) {
      if (embedded) {
        embed = this.renderVideo()
      }

      let iconVariant = 'play'

      if (card.get('type') === 'photo') {
        iconVariant = 'search-plus'
      }

      return (
        <div className={[_s.d, _s.w100PC, _s.px10].join(' ')}>
          <div className={[_s.d, _s.overflowHidden, _s.w100PC, _s.borderColorSecondary, _s.border1PX, _s.radiusSmall].join(' ')}>
            {
              !isReduced &&
              <div className={[_s.d, _s.w100PC].join(' ')}>
                <div className={[_s.d, _s.w100PC, _s.pt5625PC].join(' ')}>
                  {!!embed && embed}
                  {!embed && thumbnail}
                  {!embed &&
                    <div className={[_s.d, _s.posAbs, _s.top0, _s.right0, _s.left0, _s.bottom0, _s.aiCenter, _s.jcCenter].join(' ')}>
                      <button
                        className={[_s.d, _s.cursorPointer, _s.bgBlackOpaque, _s.radiusSmall, _s.py15, _s.px15].join(' ')}
                        onClick={this.handleEmbedClick}
                      >
                        <Icon id={iconVariant} size='22px' className={[_s.cWhite].join(' ')} />
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
            {description}
          </div>
        </div>
      )
    } else if (cardImg) {
      embed = (
        <div className={[_s.d].join(' ')}>
          {thumbnail}
        </div>
      )
    } else {
      embed = (
        <div className={[_s.d, _s.py15, _s.px15, _s.w72PX, _s.aiCenter, _s.jcCenter].join(' ')}>
          <Icon id='website' size='22px' className={_s.cSecondary} />
        </div>
      )
    }

    const containerClasses = CX({
      d: 1,
      width100PC: 1,
      flexRow: !isVertical,
    })

    return (
      <div className={[_s.d, _s.w100PC, _s.px10].join(' ')}>
        <a
          href={card.get('url')}
          rel={DEFAULT_REL}
          ref={this.setRef}
          target='_blank'
          className={[_s.d, _s.cursorPointer, _s.overflowHidden, _s.noUnderline, _s.w100PC, _s.bgSubtle_onHover, _s.borderColorSecondary, _s.border1PX, _s.radiusSmall].join(' ')}
        >
          <ResponsiveClassesComponent
            classNames={containerClasses}
            classNamesSmall={!cardImg ? undefined : [_s.d, _s.w100PC].join(' ')}
          >
            {!isReduced && embed}
            {description}
          </ResponsiveClassesComponent>
        </a>
      </div>
    )
  }

}

StatusCard.propTypes = {
  card: ImmutablePropTypes.map,
  onOpenMedia: PropTypes.func.isRequired,
  defaultWidth: PropTypes.number,
  cacheWidth: PropTypes.func,
  isReduced: PropTypes.bool,
  isVertical: PropTypes.bool,
}

export default StatusCard