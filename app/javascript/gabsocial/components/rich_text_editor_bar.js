import { RichUtils } from 'draft-js'
import { defineMessages, injectIntl } from 'react-intl'
import classNames from 'classnames/bind'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import Button from './button'

const cx = classNames.bind(_s)

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

const messages = defineMessages({
  follow: { id: 'follow', defaultMessage: 'Follow' },
})

const mapStateToProps = (state) => {
  const getAccount = makeGetAccount()
  const account = getAccount(state, me)
  const isPro = account.get('is_pro')

  return {
    isPro,
    rteControlsVisible: state.getIn(['compose', 'rte_controls_visible']),
  }
}

export default
@injectIntl
@connect(mapStateToProps)
class RichTextEditorBar extends PureComponent {

  static propTypes = {
    editorState: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    isPro: PropTypes.bool.isRequired,
    rteControlsVisible: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  toggleEditorStyle = (style, type) => {
    if (type === 'style') {
      this.props.onChange(
        RichUtils.toggleInlineStyle(this.props.editorState, style)
      )
    } else if (type === 'block') {
      this.props.onChange(
        RichUtils.toggleBlockType(this.props.editorState, style)
      )
    }
  }

  render() {
    const { isPro, rteControlsVisible, editorState } = this.props

    if (!rteControlsVisible || !isPro) return null

    return (
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

  handleOnClick = (e) => {
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

