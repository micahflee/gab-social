import {
  Editor,
  EditorState,
  CompositeDecorator,
  RichUtils
} from 'draft-js'
import { urlRegex } from '../features/compose/util/url_regex'
import classNames from 'classnames/bind'
import Button from './button'

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
  console.log("HighlightedSpan:", props)
  return (
    <span
      className={_s.colorBrand}
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  )
}

const RTE_ITEMS = [
  {
    label: 'Bold',
    style: 'BOLD',
    type: 'style',
    icon: 'circle',
  },
  {
    label: 'Italic',
    style: 'ITALIC',
    type: 'style',
    icon: 'circle',
  },
  {
    label: 'Underline',
    style: 'UNDERLINE',
    type: 'style',
    icon: 'circle',
  },
  {
    label: 'Monospace',
    style: 'CODE',
    type: 'style',
    icon: 'circle',
  },
  {
    label: 'H1',
    style: 'header-one',
    type: 'block',
    icon: 'circle',
  },
  {
    label: 'Blockquote',
    style: 'blockquote',
    type: 'block',
    icon: 'circle',
  },
  {
    label: 'UL',
    style: 'unordered-list-item',
    type: 'block',
    icon: 'circle',
  },
  {
    label: 'OL',
    style: 'ordered-list-item',
    type: 'block',
    icon: 'circle',
  },
  {
    label: 'Code Block',
    style: 'code-block',
    type: 'block',
    icon: 'circle',
  },
]

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

export default class Composer extends PureComponent {

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
  }

  state = {
    editorState: EditorState.createEmpty(compositeDecorator),
  }

  onChange = (editorState) => {
    this.setState({ editorState })
  }

  onToggleInlineStyle = (style) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style))
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

  toggleBlockType = (blockType) => {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    )
  }

  toggleInlineStyle = (inlineStyle) => {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    )
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
      onPaste
    } = this.props
    const { editorState } = this.state

    return (
      <div className={[_s.default].join(' ')}>

        <div className={[_s.default, _s.backgroundColorPrimary, _s.borderBottom1PX, _s.borderColorSecondary, _s.py5, _s.px15, _s.alignItemsCenter, _s.flexRow].join(' ')}>
          {
            RTE_ITEMS.map((item, i) => (
              <StyleButton
                key={`rte-button-${i}`}
                editorState={editorState}
                {...item}
              />
            ))
          }
        </div>

        <div
          onClick={this.focus}
          className={[_s.text, _s.fontSize16PX].join(' ')}
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
          />
        </div>
      </div>
    )
  }

}

class StyleButton extends PureComponent {
  static propTypes = {
    onToggle: PropTypes.func,
    label: PropTypes.string,
    style: PropTypes.string,
    icon: PropTypes.string,
    type: PropTypes.string,
  }

  handleOnToggle = (e) => {
    const { onToggle, style } = this.props
    e.preventDefault()
    onToggle(style)
  }

  render() {
    const {
      label,
      style,
      type,
      icon,
      editorState
    } = this.props

    const selection = editorState.getSelection()

    const currentStyle = editorState.getCurrentInlineStyle()
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()

    let active
    // active={type.style === blockType}
    // active={currentStyle.has(type.style)}
    
    const btnClasses = cx({
      px10: 1,
      mr5: 1,
      backgroundSubtle2Dark_onHover: 1,
      backgroundColorBrandLight: active,
      // py10: !small,
      // py5: small,
      // px5: small,
    })

    const iconClasses = cx({
      fillColorSecondary: !active,
      fillColorWhite: active,
    })

    return (
      <Button
        className={btnClasses}
        backgroundColor='none'
        onClick={this.handleOnToggle}
        title={label}
        icon={'rich-text'}
        iconClassName={iconClasses}
        iconWidth='10px'
        iconHeight='10px'
        radiusSmall
      />
    )
  }
}