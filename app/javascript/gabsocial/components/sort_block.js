import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import Button from '../components/button'
import DotTextSeperator from '../components/dot_text_seperator'
import Icon from '../components/icon'
import Text from '../components/text'

const messages = defineMessages({
  sortBy: { id: 'comment_sort.title', defaultMessage: 'Sort by' },
})

export default
@injectIntl
class SortBlock extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    subValue: PropTypes.string,
    onClickValue: PropTypes.func.isRequired,
    onClickSubValue: PropTypes.func,
  }

  handleOnClickValue = () => {
    this.props.onClickValue(this.valueBtn)
  }

  handleOnClickSubValue = () => {
    this.props.onClickSubValue(this.subValueBtn)
  }

  setValueBtnRef = (c) => {
    this.valueBtn = c
  }

  setSubValueBtnRef = (c) => {
    this.subValueBtn = c
  }

  render() {
    const {
      intl,
      value,
      subValue,
    } = this.props

    return (
      <div className={[_s.default, _s.px15, _s.py5, _s.mb5, _s.flexRow].join(' ')}>
        <Text color='secondary' size='small'>
          {intl.formatMessage(messages.sortBy)}
        </Text>
        <Button
          isText
          backgroundColor='none'
          color='secondary'
          className={[_s.ml5, _s.flexRow, _s.alignItemsCenter].join(' ')}
          buttonRef={this.setValueBtnRef}
          onClick={this.handleOnClickValue}
        >
          <Text color='inherit' weight='medium' size='small'>
            {value}
          </Text>
          <Icon id='caret-down' size='6px' className={[_s.colorSecondary, _s.ml5].join(' ')} />
        </Button>

        {
          !!subValue &&
          <Fragment>
            <div className={[_s.default, _s.px5].join(' ')}>
              <DotTextSeperator />
            </div>

            <Button
              isText
              backgroundColor='none'
              color='secondary'
              className={[_s.ml5, _s.flexRow, _s.alignItemsCenter].join(' ')}
              buttonRef={this.setSubValueBtnRef}
              onClick={this.handleOnClickSubValue}
            >
              <Text color='inherit' weight='medium' size='small'>
                {subValue}
              </Text>
              <Icon id='caret-down' size='6px' className={[_s.colorSecondary, _s.ml5].join(' ')} />
            </Button>
          </Fragment>
        }
      </div>
    )
  }

}