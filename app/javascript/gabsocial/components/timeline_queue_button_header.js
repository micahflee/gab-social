import { FormattedMessage } from 'react-intl'
import classNames from 'classnames/bind'
import { shortNumberFormat } from '../utils/numbers'
import { scrollTo } from '../utils/scroll_to'
import Button from './button'
import Text from './text'

const cx = classNames.bind(_s)

export default class TimelineQueueButtonHeader extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
    itemType: PropTypes.string,
    floating: PropTypes.bool,
  }

  static defaultProps = {
    count: 0,
    itemType: 'item',
  }

  handleOnClick = () => {
    scrollTo(document.documentElement, 0, 500)

    this.props.onClick()
  }

  render() {
    const { count, itemType } = this.props

    const hasItems = count > 0

    const classes = cx({
      default: 1,
      displayNone: !hasItems,
      mtNeg26PX: 1,
    })

    return (
      <div className={[_s.default, _s.pb5, _s.posSticky, _s.top120PX, _s.alignItemsCenter, _s.z4].join(' ')}>
        <div className={classes}>
          <Button
            isNarrow
            color='white'
            backgroundColor='brand'
            onClick={this.handleOnClick}
          >
            {
              hasItems &&
              <Text color='inherit' size='small'>
                <FormattedMessage
                  id='timeline_queue.label'
                  defaultMessage='{count} new {type}'
                  values={{
                    count: shortNumberFormat(count),
                    type: count === 1 ? itemType : `${itemType}s`,
                  }}
                />
              </Text>
            }
          </Button>
        </div>
      </div>
    )
  }

}