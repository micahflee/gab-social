import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import classNames from 'classnames/bind'
import { isRtl } from '../../utils/rtl'
import Button from '../button'
import Icon from '../icon'
import Text from '../text'

const MAX_HEIGHT = 200

const messages = defineMessages({
  showMore: { id: 'status.show_more', defaultMessage: 'Show more' },
  showLess: { id: 'status.show_less', defaultMessage: 'Show less' },
  readMore: { id: 'status.read_more', defaultMessage: 'Read more' },
})

const cx = classNames.bind(_s)

export default
@injectIntl
class StatusContent extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    reblogStatus: PropTypes.string,
    expanded: PropTypes.bool,
    onExpandedToggle: PropTypes.func,
    onClick: PropTypes.func,
    collapsable: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    isComment: PropTypes.bool,
  }

  state = {
    hidden: true,
    collapsed: null, // `collapsed: null` indicates that an element doesn't need collapsing, while `true` or `false` indicates that it does (and is/isn't).
  }

  _updateStatusLinks() {
    const node = this.node

    if (!node) return

    const links = node.querySelectorAll('a')

    for (var i = 0; i < links.length; ++i) {
      let link = links[i]
      if (link.classList.contains('status-link')) {
        continue
      }
      link.classList.add('status-link')

      let mention = this.props.status.get('mentions').find(item => link.href === `${item.get('url')}`)

      if (mention) {
        link.addEventListener('click', this.onMentionClick.bind(this, mention), false)
        link.setAttribute('title', mention.get('acct'))
      } else if (link.textContent[0] === '#' || (link.previousSibling && link.previousSibling.textContent && link.previousSibling.textContent[link.previousSibling.textContent.length - 1] === '#')) {
        link.addEventListener('click', this.onHashtagClick.bind(this, link.text), false)
      } else {
        link.setAttribute('title', link.href)
      }
    }

    if (
      this.props.collapsable
      && this.props.onClick
      && this.state.collapsed === null
      && node.clientHeight > MAX_HEIGHT
      && this.props.status.get('spoiler_text').length === 0
    ) {
      this.setState({ collapsed: true })
    }
  }

  componentDidMount() {
    this._updateStatusLinks()
  }

  componentDidUpdate() {
    this._updateStatusLinks()
  }

  onMentionClick = (mention, e) => {
    if (this.context.router && e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      this.context.router.history.push(`/${mention.get('acct')}`)
    }
  }

  onHashtagClick = (hashtag, e) => {
    hashtag = hashtag.replace(/^#/, '').toLowerCase()

    if (this.context.router && e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      this.context.router.history.push(`/tags/${hashtag}`)
    }
  }

  handleMouseDown = (e) => {
    this.startXY = [e.clientX, e.clientY]
  }

  handleMouseUp = (e) => {
    if (!this.startXY) return

    const [startX, startY] = this.startXY
    const [deltaX, deltaY] = [Math.abs(e.clientX - startX), Math.abs(e.clientY - startY)]

    if (e.target.localName === 'button' ||
      e.target.localName === 'a' ||
      (e.target.parentNode && (e.target.parentNode.localName === 'button' || e.target.parentNode.localName === 'a'))) {
      return
    }

    if (deltaX + deltaY < 5 && e.button === 0 && this.props.onClick) {
      this.props.onClick()
    }

    this.startXY = null
  }

  handleSpoilerClick = (e) => {
    e.preventDefault()

    if (this.props.onExpandedToggle) {
      // The parent manages the state
      this.props.onExpandedToggle()
    } else {
      this.setState({ hidden: !this.state.hidden })
    }
  }

  handleReadMore = (e) => {
    e.preventDefault()
    this.setState({ collapsed: false })
  }

  setRef = (c) => {
    this.node = c
  }

  getHtmlContent = () => {
    const { status, reblogContent } = this.props

    const properContent = status.get('contentHtml')

    return reblogContent
      ? `${reblogContent} <div class='status__quote'>${properContent}</div>`
      : properContent
  }

  render() {
    const { status, intl, isComment } = this.props
    const { collapsed } = this.state

    if (status.get('content').length === 0) return null

    const hidden = this.props.onExpandedToggle ? !this.props.expanded : this.state.hidden

    const content = { __html: this.getHtmlContent() }
    const spoilerContent = { __html: status.get('spoilerHtml') }
    const directionStyle = {
      direction: isRtl(status.get('search_index')) ? 'rtl' : 'ltr',
    }

    if (status.get('spoiler_text').length > 0) {
      let mentionsPlaceholder = null

      const mentionLinks = status.get('mentions').map(item => (
        <Button
          text
          backgroundColor='none'
          to={`/${item.get('acct')}`}
          href={`/${item.get('acct')}`}
          key={item.get('id')}
          className={['mention', _s.mr5, _s.mb5].join(' ')}
        >
          @{item.get('username')}
        </Button>
      )).reduce((aggregate, item) => [...aggregate, item, ' '], [])

      if (hidden) {
        mentionsPlaceholder = (
          <div className={[_s.statusContent, _s.default, _s.alignItemsStart, _s.flexRow, _s.flexWrap].join(' ')}>
            {mentionLinks}
          </div>
        )
      }

      const toggleText = intl.formatMessage(hidden ? messages.showMore : messages.showLess)

      const spoilerContainerClasses = cx({
        default: 1,
        py10: 1,
        borderBottom1PX: !hidden,
        borderColorSecondary: !hidden,
        mb10: !hidden,
      })

      const statusContentClasses = cx({
        statusContent: 1,
        displayNone: hidden,
      })

      return (
        <div
          className={[].join(' ')}
          ref={this.setRef}
          tabIndex='0'
          className={[_s.px15, _s.statusContent].join(' ')}
          style={directionStyle}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        >

          <div className={spoilerContainerClasses}>
            <div className={[_s.default, _s.flexRow, _s.mr5].join(' ')}>
              <Icon id='warning' height='14px' width='14px' className={[_s.fillColorBlack, _s.mt2, _s.mr5].join(' ')}/>
              <div
                className={_s.statusContent}
                dangerouslySetInnerHTML={spoilerContent}
                lang={status.get('language')}
              />
            </div>

            <div className={[_s.default, _s.mt10, _s.alignItemsStart].join(' ')}>
              <Button
                narrow
                radiusSmall
                backgroundColor='tertiary'
                color='primary'
                tabIndex='0'
                onClick={this.handleSpoilerClick}
              >
                <Text size='small' color='inherit'>
                  {toggleText}
                </Text>
              </Button>
            </div>
          </div>

          {mentionsPlaceholder}

          <div
            tabIndex={!hidden ? 0 : null}
            className={statusContentClasses}
            style={directionStyle}
            dangerouslySetInnerHTML={content}
            lang={status.get('language')}
          />
        </div>
      )
    } else if (this.props.onClick) {
      const hasMarginBottom = !!status.get('card') || !!status.get('poll') || status.get('media_attachments').size > 0

      const containerClasses = cx({
        px15: !isComment,
        mb15: hasMarginBottom,
      })

      const statusContentClasses = cx({
        statusContent: 1,
        height220PX: collapsed,
        overflowHidden: collapsed,
      })

      return (
        <div className={containerClasses}>
          <div
            ref={this.setRef}
            tabIndex='0'
            className={statusContentClasses}
            style={directionStyle}
            dangerouslySetInnerHTML={content}
            lang={status.get('language')}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
          />
          {
            this.state.collapsed &&
            <button
              className={[_s.default, _s.displayFlex, _s.cursorPointer, _s.py2, _s.text, _s.colorPrimary, _s.fontWeightBold, _s.fontSize15PX].join(' ')}
              onClick={this.handleReadMore}
            >
              {intl.formatMessage(messages.readMore)}
            </button>
          }
        </div>
      )
    }

    return (
      <div
        tabIndex='0'
        ref={this.setRef}
        className={[_s.px15, _s.mb15, _s.statusContent].join(' ')}
        style={directionStyle}
        dangerouslySetInnerHTML={content}
        lang={status.get('language')}
      />
    )
  }

}
