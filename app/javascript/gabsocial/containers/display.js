import {
  FONT_SIZES,
  THEMES,
  DEFAULT_THEME,
  DEFAULT_FONT_SIZE,
} from '../constants'

export default class Display extends PureComponent {

  static propTypes = {
    theme: PropTypes.string.isRequired,
    rounded: PropTypes.bool.isRequired,
    fontSize: PropTypes.string.isRequired,
  }

  state = {
    theme: this.props.theme,
    rounded: this.props.rounded,
    fontSize: this.props.fontSize,
  }

  static defaultProps = {
    theme: 'BLACK',
    rounded: false,
    fontSize: 'normal',
  }

  componentDidMount() {
    this.updateTheme(this.state.theme)
    this.updateRounded(this.state.rounded)
    this.updateFontSizes(this.state.fontSize)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.theme !== prevState.theme ||
      nextProps.rounded !== prevState.rounded ||
      nextProps.fontSize !== prevState.fontSize) {
      return {
        theme: nextProps.theme,
        rounded: nextProps.rounded,
        fontSize: nextProps.fontSize,
      }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.theme !== this.state.theme) {
      this.updateTheme(this.state.theme)
    }

    if (prevState.rounded !== this.state.rounded) {
      this.updateRounded(this.state.rounded)
    }
    
    if (prevState.fontSize !== this.state.fontSize) {
      this.updateFontSizes(this.state.fontSize)
    }
  }

  updateRounded(rounded) {
    if (rounded) {
      document.documentElement.removeAttribute('rounded')
    } else {
      document.documentElement.setAttribute('rounded', '')
    }
  }

  updateFontSizes(fontSize) {
    let correctedFontSize = fontSize.toUpperCase()
    if (!FONT_SIZES.hasOwnProperty(correctedFontSize)) {
      correctedFontSize = DEFAULT_FONT_SIZE
    }

    document.documentElement.style.setProperty('font-size', FONT_SIZES[correctedFontSize]);
  }

  updateTheme(theme) {
    let correctedTheme = theme.toLowerCase()
    if (!THEMES.hasOwnProperty(correctedTheme)) {
      correctedTheme = DEFAULT_THEME
    }

    document.documentElement.setAttribute('theme', correctedTheme);
  }

  render() {
    return this.props.children
  }

}