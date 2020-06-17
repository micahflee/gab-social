import {
  Editor,
  EditorState,
  CompositeDecorator,
  RichUtils,
  convertToRaw,
  ContentState,
} from 'draft-js'
import draftToMarkdown from '../features/ui/util/draft-to-markdown'
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

function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback)
}

function urlStrategy(contentBlock, callback, contentState) {
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

const HANDLE_REGEX = /\@[\w]+/g
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g

export default class Composer extends PureComponent {

  static propTypes = {
    inputRef: PropTypes.func,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
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
    plainText: this.props.value,
  }

  componentDidUpdate() {
    if (this.state.plainText !== this.props.value) {
      let editorState
      if (!this.props.value) {
        editorState = EditorState.createEmpty(compositeDecorator)
      } else {
        editorState = EditorState.push(this.state.editorState, ContentState.createFromText(this.props.value))
      }
      this.setState({
        editorState,
        plainText: this.props.value,
      })
    }
  }

  onChange = (editorState) => {
    const content = editorState.getCurrentContent()
    const plainText = content.getPlainText('\u0001')

    this.setState({ editorState, plainText })

    const selectionState = editorState.getSelection()
    const selectionStart = selectionState.getStartOffset()

    const rawObject = convertToRaw(content)
    const markdownString = draftToMarkdown(rawObject, {
      escapeMarkdownCharacters: false,
      preserveNewlines: false,
      remarkablePreset: 'commonmark',
      remarkableOptions: {
        disable: {
          block: ['table']
        },
        enable: {
          inline: ['del', 'ins'],
        }
      }
    })

    this.props.onChange(null, plainText, markdownString, selectionStart)
  }

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

  onTab = (e) => {
    const maxDepth = 4
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
  }

  setRef = (n) => {
    try {
      this.textbox = n
      this.props.inputRef(n) 
    } catch (error) {
      //
    }
  }

  render() {
    const {
      disabled,
      placeholder,
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
      colorPrimary: 1,
      fs16PX: !small,
      fs14PX: small,
      pt15: !small,
      px15: !small,
      px10: small,
      pb10: !small,
    })

    return (
      <div className={_s.default}>

        {
          !small &&
          <RichTextEditorBar
            editorState={editorState}
            onChange={this.onChange}
          />
        }

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
            onBlur={onBlur}
            onFocus={onFocus}
            stripPastedStyles
          />
        </div>
      </div>
    )
  }

}