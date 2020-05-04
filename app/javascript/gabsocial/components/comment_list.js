import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Button from './button'
import Comment from './comment'
import ScrollableList from './scrollable_list'
import Text from './text'
import { PureComponent } from 'react';

export default class CommentList extends ImmutablePureComponent {

  static propTypes = {
    commentsLimited: PropTypes.bool,
    descendants: ImmutablePropTypes.list,
    onViewComments: PropTypes.func.isRequired,
  }

  render() {
    const {
      descendants,
      commentsLimited,
      onViewComments
    } = this.props

    const size = descendants.size
    const upperLimit = commentsLimited ? 6 : size
    const max = Math.min(commentsLimited ? 2 : upperLimit, size)

    console.log("size, max:", size, max)

    const Wrapper = !commentsLimited ? ScrollableList : DummyContainer

    return (
      <div>
        <Wrapper scrollKey='comments'>
          {
            descendants.slice(0, max).map((descendant, i) => (
              <Comment
                key={`comment-${descendant.get('statusId')}-${i}`}
                id={descendant.get('statusId')}
                indent={descendant.get('indent')}
              />
            ))
          }
        </Wrapper>
        {
          size > 0 && size > max && commentsLimited &&
          <div className={[_s.default, _s.flexRow, _s.px15, _s.pb5, _s.mb10, _s.alignItemsCenter].join(' ')}>
            <Button
              isText
              backgroundColor='none'
              color='tertiary'
              onClick={onViewComments}
            >
              <Text weight='bold' color='inherit'>
                View more comments
              </Text>
            </Button>
            <div className={[_s.default, _s.mlAuto].join(' ')}>
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

class DummyContainer extends PureComponent {
  render() {
    return <div>{this.props.children}</div>
  }
}