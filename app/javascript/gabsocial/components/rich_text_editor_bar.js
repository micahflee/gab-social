import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RichUtils } from 'draft-js'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import { CX } from '../constants'
import Icon from './icon'

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
  {
    label: 'Monospace',
    style: 'CODE',
    type: 'style',
    icon: 'code',
  },
  // {
  //   label: 'Title',
  //   style: 'header-one',
  //   type: 'block',
  //   icon: 'text-size',
  // },
  // {
  //   label: 'Blockquote',
  //   style: 'blockquote',
  //   type: 'block',
  //   icon: 'blockquote',
  // },
  // {
  //   label: 'Code Block',
  //   style: 'code-block',
  //   type: 'block',
  //   icon: 'code',
  // },
  // {
  //   label: 'UL',
  //   style: 'unordered-list-item',
  //   type: 'block',
  //   icon: 'ul-list',
  // },
  // {
  //   label: 'OL',
  //   style: 'ordered-list-item',
  //   type: 'block',
  //   icon: 'ol-list',
  // },
]

class RichTextEditorBar extends React.PureComponent {

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
      <div className={[_s.d, _s.bgPrimary, _s.borderBottom1PX, _s.borderColorSecondary, _s.py5, _s.px15, _s.aiCenter, _s.flexRow].join(' ')}>
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
        {/*<Button
          backgroundColor='none'
          color='secondary'
          onClick={this.handleOnTogglePopoutEditor}
          title='Fullscreen'
          className={[_s.px10, _s.noSelect, _s.mlAuto].join(' ')}
          icon='fullscreen'
          iconClassName={_s.inheritFill}
          iconSize='12px'
          radiusSmall
        />*/}
      </div>
    )
  }

}

class StyleButton extends React.PureComponent {

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
    const iconColor = active ? 'cWhite' : 'cSecondary'

    const btnClasses = CX({
      d: 1,
      noUnderline: 1,
      cursorPointer: 1,
      px10: 1,
      mr5: 1,
      noSelect: 1,
      bgSubtle_onHover: 1,
      bgBrandLight: active,
      bgTransparent: 1,
      radiusSmall: 1,
      outlineNone: 1,
      py10: 1,
    })

    return (
      <button
        className={btnClasses}
        onMouseDown={this.handleOnClick}
        title={label}
      >
        <Icon id={icon} size='16px' className={_s[iconColor]} />
      </button>
    )
  }

}

StyleButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  style: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
}

const mapStateToProps = (state) => {
  const getAccount = makeGetAccount()
  const account = getAccount(state, me)
  const isPro = account.get('is_pro')

  return {
    isPro,
    rteControlsVisible: state.getIn(['compose', 'rte_controls_visible']),
  }
}

RichTextEditorBar.propTypes = {
  editorState: PropTypes.object.isRequired,
  isPro: PropTypes.bool.isRequired,
  rteControlsVisible: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(RichTextEditorBar)