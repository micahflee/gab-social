import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import punycode from 'punycode';
import classnames from 'classnames';
import Icon from '../../../../components/icon';

const IDNA_PREFIX = 'xn--';

const decodeIDNA = domain => {
  return domain
    .split('.')
    .map(part => part.indexOf(IDNA_PREFIX) === 0 ? punycode.decode(part.slice(IDNA_PREFIX.length)) : part)
    .join('.');
};

const getHostname = url => {
  const parser = document.createElement('a');
  parser.href = url;
  return parser.hostname;
};

const trim = (text, len) => {
  const cut = text.indexOf(' ', len);

  if (cut === -1) {
    return text;
  }

  return text.substring(0, cut) + (text.length > len ? '…' : '');
};

const domParser = new DOMParser();

const addAutoPlay = html => {
  const document = domParser.parseFromString(html, 'text/html').documentElement;
  const iframe = document.querySelector('iframe');

  if (iframe) {
    if (iframe.src.indexOf('?') !== -1) {
      iframe.src += '&';
    } else {
      iframe.src += '?';
    }

    iframe.src += 'autoplay=1&auto_play=1';

    // DOM parser creates html/body elements around original HTML fragment,
    // so we need to get innerHTML out of the body and not the entire document
    return document.querySelector('body').innerHTML;
  }

  return html;
};

export default class Card extends ImmutablePureComponent {

  static propTypes = {
    card: ImmutablePropTypes.map,
    onOpenMedia: PropTypes.func.isRequired,
    defaultWidth: PropTypes.number,
    cacheWidth: PropTypes.func,
  };

  static defaultProps = {
  };

  state = {
    width: this.props.defaultWidth || 280,
    embedded: false,
  };

  componentWillReceiveProps (nextProps) {
    if (!Immutable.is(this.props.card, nextProps.card)) {
      this.setState({ embedded: false });
    }
  }

  handlePhotoClick = () => {
    const { card, onOpenMedia } = this.props;

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
    );
  };

  handleEmbedClick = () => {
    const { card } = this.props;

    if (card.get('type') === 'photo') {
      this.handlePhotoClick();
    } else {
      this.setState({ embedded: true });
    }
  }

  setRef = c => {
    if (c) {
      if (this.props.cacheWidth) this.props.cacheWidth(c.offsetWidth);
      this.setState({ width: c.offsetWidth });
    }
  }

  renderVideo () {
    const { card }  = this.props
    const content   = { __html: addAutoPlay(card.get('html')) }
    const { width } = this.state
    const ratio     = card.get('width') / card.get('height')
    const height    = width / ratio

    return (
      <div
        ref={this.setRef}
        className={[styles.default, styles.backgroundColorSubtle3, styles.positionAbsolute, styles.top0, styles.right0, styles.bottom0, styles.left0, styles.statusCardVideo].join(' ')}
        dangerouslySetInnerHTML={content}
      />
    )
  }

  render () {
    const { card } = this.props
    const { width, embedded } = this.state

    if (card === null) return null

    const maxDescription = 160
    const cardImg = card.get('image')
    const provider = card.get('provider_name').length === 0 ? decodeIDNA(getHostname(card.get('url'))) : card.get('provider_name')
    const horizontal = (card.get('width') > card.get('height') && (card.get('width') + 100 >= width)) || card.get('type') !== 'link' || embedded
    const interactive = card.get('type') !== 'link'

    const title = interactive ?
      (
        <a
          className={[styles.default, styles.displayFlex, styles.text, styles.noUnderline, styles.overflowWrapBreakWord, styles.colorBlack, styles.fontSize15PX, styles.fontWeight500].join(' ')}
          href={card.get('url')}
          title={card.get('title')}
          rel='noopener'
          target='_blank'
        >
          {card.get('title')}
        </a>
      )
      : (
        <span className={[styles.default, styles.displayFlex, styles.text, styles.overflowWrapBreakWord, styles.colorBlack, styles.fontSize15PX, styles.fontWeight500].join(' ')}>
          {card.get('title')}
        </span>
      )

    const description = (
      <div className={[styles.default, styles.flexNormal, styles.paddingHorizontal10PX, styles.paddingVertical10PX, styles.borderColorSubtle, styles.borderLeft1PX].join(' ')}>
        {title}
        <p className={[styles.default, styles.displayFlex, styles.text, styles.marginVertical5PX, styles.overflowWrapBreakWord, styles.colorSubtle, styles.fontSize13PX, styles.fontWeightNormal].join(' ')}>
          {trim(card.get('description') || '', maxDescription)}
        </p>
        <span className={[styles.default, styles.marginTopAuto, styles.flexRow, styles.alignItemsCenter, styles.colorSubtle, styles.text, styles.displayFlex, styles.textOverflowEllipsis, styles.fontSize13PX].join(' ')}>
          <Icon id='link' width='12px' height='12px' className={[styles.fillColorSubtle, styles.marginRight5PX].join(' ')} fixedWidth />
          {provider}
        </span>
      </div>
    )

    let embed = ''
    let thumbnail = interactive ?
      <img src={cardImg} className={[styles.default, styles.objectFitCover, styles.positionAbsolute, styles.width100PC, styles.height100PC, styles.top0, styles.right0, styles.bottom0, styles.left0].join(' ')} />
      :
      <img src={cardImg} className={[styles.default, styles.objectFitCover, styles.width400PX, styles.height260PX].join(' ')} />

    if (interactive) {
      if (embedded) {
        embed = this.renderVideo()
      }

      let iconVariant = 'play'

      if (card.get('type') === 'photo') {
        iconVariant = 'search-plus'
      }

      return (
        <div className={[styles.default, styles.width100PC, styles.paddingHorizontal10PX].join(' ')}>
          <div className={[styles.default, styles.overflowHidden, styles.width100PC, styles.borderColorSubtle2, styles.border1PX, styles.radiusSmall].join(' ')}>
            <div className={[styles.default, styles.width100PC].join(' ')}>
              <div className={[styles.default, styles.width100PC, styles.paddingTop5625PC].join(' ')}>
                { !!embed && embed}
                { !embed && thumbnail}
                { !embed &&
                  <div className={[styles.default, styles.positionAbsolute, styles.top0, styles.right0, styles.left0, styles.bottom0, styles.alignItemsCenter, styles.justifyContentCenter].join(' ')}>
                    <button
                      className={[styles.default, styles.cursorPointer, styles.backgroundColorOpaque, styles.radiusSmall, styles.paddingVertical15PX, styles.paddingHorizontal15PX].join(' ')}
                      onClick={this.handleEmbedClick}
                    >
                      <Icon id={iconVariant} className={[styles.fillColorWhite].join(' ')}/>
                    </button>
                  </div>
                }
              </div>
            </div>
            {description}
          </div>
        </div>
      )
    } else if (cardImg) {
      embed = (
        <div className={[styles.default].join(' ')}>
          {thumbnail}
        </div>
      )
    } else {
      embed = (
        <div className={[styles.default, styles.paddingVertical15PX, styles.paddingHorizontal15PX, styles.width72PX, styles.alignItemsCenter, styles.justifyContentCenter].join(' ')}>
          <Icon id='file-text' width='22px' height='22px' className={styles.fillColorSubtle} />
        </div>
      )
    }

    return (
      <div className={[styles.default, styles.width100PC, styles.paddingHorizontal10PX].join(' ')}>
        <a
          href={card.get('url')}
          className={[styles.default, styles.cursorPointer, styles.flexRow, styles.overflowHidden, styles.noUnderline, styles.width100PC, styles.borderColorSubtle2, styles.border1PX, styles.radiusSmall].join(' ')}
          rel='noopener'
          ref={this.setRef}
          >
          {embed}
          {description}
        </a>
        </div>
    )
  }

}
