import {
  Editor,
  EditorState,
  CompositeDecorator,
  RichUtils,
  convertToRaw,
  convertFromRaw
} from 'draft-js'
import { draftToMarkdown } from 'markdown-draft-js'
// import draftToMarkdown from 'draftjs-to-markdown'
import { urlRegex } from '../features/ui/util/url_regex'
import classNames from 'classnames/bind'
import RichTextEditorBar from './rich_text_editor_bar'

import '!style-loader!css-loader!draft-js/dist/Draft.css'

const cx = classNames.bind(_s)

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    default:
      return null
  }
}

function handleStrategy(contentBlock, callback, contentState) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback)
}

function hashtagStrategy (contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback)
}

function urlStrategy (contentBlock, callback, contentState) {
  findWithRegex(urlRegex, contentBlock, callback)
}

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

const HighlightedSpan = (props) => {
  return (
    <span
      className={_s.colorBrand}
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  )
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: handleStrategy,
    component: HighlightedSpan,
  },
  {
    strategy: hashtagStrategy,
    component: HighlightedSpan,
  },
  {
    strategy: urlStrategy,
    component: HighlightedSpan,
  }
])

const HANDLE_REGEX = /\@[\w]+/g;
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;


const mapDispatchToProps = (dispatch) => ({

})

export default
@connect(null, mapDispatchToProps)
class Composer extends PureComponent {

  static propTypes = {
    inputRef: PropTypes.func,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onPaste: PropTypes.func,
    small: PropTypes.bool,
  }

  state = {
    editorState: EditorState.createEmpty(compositeDecorator),
  }

  onChange = (editorState) => {
    this.setState({ editorState })
    const content = this.state.editorState.getCurrentContent();
    const text = content.getPlainText('\u0001')
    
    const selectionState = editorState.getSelection()
    const selectionStart = selectionState.getStartOffset()

    const rawObject = convertToRaw(content);
    const markdownString = draftToMarkdown(rawObject);
    // const markdownString = draftToMarkdown(rawObject, {
    //   trigger: '#',
    //   separator: ' ',
    // });

    console.log("markdownString:", markdownString)

    this.props.onChange(null, text, selectionStart, markdownString)
  }

// **bold**
// *italic*
// __underline__
// ~strikethrough~
// # title
// > quote
// `code`
// ```code```


  focus = () => {
    this.textbox.editor.focus()
  }

  handleKeyCommand = (command) => {
    const { editorState } = this.state
    const newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      this.onChange(newState)
      return true
    }

    return false
  }

  handleOnTogglePopoutEditor = () => {
    //
  }

  onTab = (e) => {
    const maxDepth = 4
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
  }

  setRef = (n) => {
    this.textbox = n
  }

  render() {
    const {
      inputRef,
      disabled,
      placeholder,
      autoFocus,
      // value,
      onChange,
      onKeyDown,
      onKeyUp,
      onFocus,
      onBlur,
      onPaste,
      small,
    } = this.props
    const { editorState } = this.state

    const editorContainerClasses = cx({
      default: 1,
      cursorText: 1,
      text: 1,
      fs16PX: !small,
      fs14PX: small,
      pt15: !small,
      px15: !small,
      px10: small,
      pt10: small,
      pb10: 1,
    })

    return (
      <div className={_s.default}>

        <RichTextEditorBar
          editorState={editorState}
          onChange={this.onChange}
        />

        <div
          onClick={this.focus}
          className={editorContainerClasses}
        >
          <Editor
            blockStyleFn={getBlockStyle}
            // customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder={placeholder}
            ref={this.setRef}
            readOnly={disabled}
          />
        </div>
      </div>
    )
  }

}