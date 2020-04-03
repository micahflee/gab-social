import {
  Editor,
  EditorState,
  CompositeDecorator,
  RichUtils
} from 'draft-js'
import { urlRegex } from '../features/compose/util/url_regex'
import classNames from 'classnames/bind'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import Button from './button'

import 'draft-js/dist/Draft.css'

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
    icon: 'bold',
  },
  {
    label: 'Italic',
    style: 'ITALIC',
    type: 'style',
    icon: 'italic',
  },
  {
    label: 'Underline',
    style: 'UNDERLINE',
    type: 'style',
    icon: 'underline',
  },
  {
    label: 'Strikethrough',
    style: 'STRIKETHROUGH',
    type: 'style',
    icon: 'strikethrough',
  },
  // {
  //   label: 'Monospace',
  //   style: 'CODE',
  //   type: 'style',
  //   icon: 'circle',
  // },
  {
    label: 'H1',
    style: 'header-one',
    type: 'block',
    icon: 'text-size',
  },
  {
    label: 'Blockquote',
    style: 'blockquote',
    type: 'block',
    icon: 'blockquote',
  },
  {
    label: 'Code Block',
    style: 'code-block',
    type: 'block',
    icon: 'code',
  },
  {
    label: 'UL',
    style: 'unordered-list-item',
    type: 'block',
    icon: 'ul-list',
  },
  {
    label: 'OL',
    style: 'ordered-list-item',
    type: 'block',
    icon: 'ol-list',
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

const mapStateToProps = state => {
  const getAccount = makeGetAccount()
  const account = getAccount(state, me)
  const isPro = account.get('is_pro')

  return {
    isPro,
    rteControlsVisible: state.getIn(['compose', 'rte_controls_visible']),
  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
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
    isPro: PropTypes.bool.isRequired,
    rteControlsVisible: PropTypes.bool.isRequired,
  }

  state = {
    editorState: EditorState.createEmpty(compositeDecorator),
  }

  onChange = (editorState) => {
    this.setState({ editorState })
    const text = editorState.getCurrentContent().getPlainText('\u0001')
    this.props.onChange(text)
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

  toggleEditorStyle = (style, type) => {
    console.log("toggleEditorStyle:", style, type)
    if (type === 'style') {
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, style)
      )
    } else if (type === 'block') {
      this.onChange(
        RichUtils.toggleBlockType(this.state.editorState, style)
      )
    }
  }

  handleOnTogglePopoutEditor = () => {
    //
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
      isPro,
      rteControlsVisible
    } = this.props
    const { editorState } = this.state

    const editorContainerClasses = cx({
      default: 1,
      RTE: 1,
      cursorText: 1,
      text: 1,
      fontSize16PX: !small,
      fontSize14PX: small,
      pt15: !small,
      px15: !small,
      px10: small,
      pt10: small,
      pb10: 1,
    })

    return (
      <div className={[_s.default].join(' ')}>

        {
          rteControlsVisible && isPro &&
          <div className={[_s.default, _s.backgroundColorPrimary, _s.borderBottom1PX, _s.borderColorSecondary, _s.py5, _s.px15, _s.alignItemsCenter, _s.flexRow].join(' ')}>
            {
              RTE_ITEMS.map((item, i) => (
                <StyleButton
                  key={`rte-button-${i}`}
                  editorState={editorState}
                  onClick={this.toggleEditorStyle}
                  {...item}
                />
              ))
            }
            <Button
              backgroundColor='none'
              color='secondary'
              onClick={this.handleOnTogglePopoutEditor}
              title='Fullscreen'
              className={[_s.px10, _s.noSelect, _s.marginLeftAuto].join(' ')}
              icon='fullscreen'
              iconClassName={_s.inheritFill}
              iconWidth='12px'
              iconHeight='12px'
              radiusSmall
            />
          </div>
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
            // placeholder={placeholder}
            ref={this.setRef}
          />
        </div>
      </div>
    )
  }

}

class StyleButton extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string,
    style: PropTypes.string,
    icon: PropTypes.string,
    type: PropTypes.string,
  }

  handleOnClick
   = (e) => {
    e.preventDefault()
    this.props.onClick(this.props.style, this.props.type)
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

    const active = type === 'block' ? style === blockType : currentStyle.has(style)
    const color = active ? 'white' : 'secondary'

    const btnClasses = cx({
      px10: 1,
      mr5: 1,
      noSelect: 1,
      backgroundSubtle2Dark_onHover: 1,
      backgroundColorBrandLight: active,
      // py10: !small,
      // py5: small,
      // px5: small,
    })

    return (
      <Button
        className={btnClasses}
        backgroundColor='none'
        color={color}
        onClick={this.handleOnClick}
        title={label}
        icon={icon}
        iconClassName={_s.inheritFill}
        iconWidth='12px'
        iconHeight='12px'
        radiusSmall
      />
    )
  }
}

