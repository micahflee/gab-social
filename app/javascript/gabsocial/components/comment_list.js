import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Button from './button'
import Comment from './comment'
import Text from './text'

export default class CommentList extends ImmutablePureComponent {

  static propTypes = {
    commentsLimited: PropTypes.bool,
    descendants: ImmutablePropTypes.list,
  }

  render() {
    const {
      descendants,
      commentsLimited,
    } = this.props

    const size = descendants.size
    const max = Math.min(commentsLimited ? 2 : 6, size)
    console.log("max:", size, max)

    return (
      <div>
        {
          descendants.slice(0, max).map((descendant, i) => (
            <Comment
              key={`comment-${descendant.get('statusId')}-${i}`}
              id={descendant.get('statusId')}
              indent={descendant.get('indent')}
            />
          ))
        }
        {
          size > 0 && size > max &&
          <div className={[_s.default, _s.flexRow, _s.px15, _s.pb5, _s.mb10, _s.alignItemsCenter].join(' ')}>
            <Button
              text
              backgroundColor='none'
              color='tertiary'
            >
              <Text weight='bold' color='inherit'>
                View more comments
              </Text>
            </Button>
            <div className={[_s.default, _s.marginLeftAuto].join(' ')}>
              <Text color='tertiary'>
                {max}
                &nbsp;of&nbsp;
                {size}
              </Text>
            </div>
          </div>
        }
      </div>
    )
  }

}
