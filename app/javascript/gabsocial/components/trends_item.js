import { Fragment } from 'react'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { urlRegex } from '../features/ui/util/url_regex'
import {
  CX,
  DEFAULT_REL,
} from '../constants'
import Button from './button'
import DotTextSeperator from './dot_text_seperator'
import Image from './image'
import RelativeTimestamp from './relative_timestamp'
import Text from './text'

export default class TrendingItem extends ImmutablePureComponent {

  static propTypes = {
    index: PropTypes.number,
    trend: ImmutablePropTypes.map.isRequired,
    isLast: PropTypes.bool,
    isHidden: PropTypes.bool,
  }

  static defaultProps = {
    title: '',
    description: '',
    author: '',
  }

  state = {
    hovering: false,
  }

  handleOnMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleOnMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const {
      index,
      trend,
      isLast,
      isHidden,
    } = this.props
    const { hovering } = this.state

    if (!trend) return null

    const title = trend.get('title') || ''
    const description = trend.get('description') || ''
      
    const correctedAuthor = trend.getIn(['author', 'name'], '').replace('www.', '')
    const correctedDescription = description.length >= 120 ? `${description.substring(0, 120).trim()}...` : description
    const descriptionHasLink = correctedDescription.match(urlRegex)

    if (isHidden) {
      return (
        <Fragment>
          {title}
          {!descriptionHasLink && correctedDescription}
          {correctedAuthor}
        </Fragment>
      )
    }

    const containerClasses = CX({
      default: 1,
      noUnderline: 1,
      px15: 1,
      pt10: 1,
      pb5: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
      backgroundColorSubtle_onHover: 1,
    })

    const subtitleClasses = CX({
      ml5: 1,
      underline: hovering,
    })

    return (
      <Button
        noClasses
        href={trend.get('url')}
        target='_blank'
        rel={DEFAULT_REL}
        className={containerClasses}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
        <Image
          nullable
          width='116px'
          height='78px'
          alt={title}
          src={trend.get('image')}
          className={[_s.radiusSmall, _s.overflowHidden, _s.mb10].join(' ')}
        />

        <div className={[_s.default, _s.flexNormal, _s.pb5].join(' ')}>
          <div className={_s.default}>
            <Text size='medium' color='primary' weight='bold'>
              {title}
            </Text>
          </div>

          {
            !!correctedDescription && !descriptionHasLink &&
            <div className={[_s.default, _s.heightMax56PX, _s.overflowHidden, _s.pt5, _s.mb5].join(' ')}>
              <Text size='small' color='secondary'>
                {correctedDescription}
              </Text>
            </div>
          }
          
          <div className={[_s.default, _s.flexRow].join(' ')}>
            <Text color='secondary' size='small'>
              {index}
            </Text>
            <DotTextSeperator />
            <Text color='secondary' size='small' className={_s.ml5}>
              {correctedAuthor}
            </Text>
            <DotTextSeperator />
            <Text color='secondary' size='small' className={subtitleClasses}>
              <RelativeTimestamp timestamp={trend.get('date_published')} />
            </Text>
            {
              hovering &&
              <Text color='secondary' size='small' className={_s.ml10}>→</Text>
            }
          </div>

        </div>
      </Button>
    )
  }

}
