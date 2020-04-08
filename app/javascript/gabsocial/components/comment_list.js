import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Comment from './comment'

export default class CommentList extends ImmutablePureComponent {

  static propTypes = {
    descendants: ImmutablePropTypes.list,
  }

  render() {
    const { descendants } = this.props

    return (
      <div>
        {
          descendants.map((descendant, i) => (
            <Comment
              key={`comment-${descendant.get('statusId')}-${i}`}
              id={descendant.get('statusId')}
              indent={descendant.get('indent')}
            />
          ))
        }
      </div>
    )
  }

}
