import {
  Editor,
  EditorState,
  RichUtils
} from 'draft-js'

export default class Composer extends PureComponent {

  state = {
    editorState: EditorState.createEmpty(),
  }

  onChange = (editorState) => {
    this.setState({ editorState })
  }

  onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  render() {
    return (
      <div>

      {/*<button onClick={this.onBoldClick.bind(this)}>Bold</button>*/}

      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
      />

      </div>
    )
  }

}
