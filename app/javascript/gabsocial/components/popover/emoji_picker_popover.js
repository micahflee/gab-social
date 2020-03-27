import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { Map as ImmutableMap } from 'immutable'
import classNames from 'classnames'
import { createSelector } from 'reselect'
import detectPassiveEvents from 'detect-passive-events'
import { changeSetting } from '../../actions/settings'
import { useEmoji } from '../../actions/emojis'
import { EmojiPicker as EmojiPickerAsync } from '../../features/ui/util/async_components'
import { buildCustomEmojis } from '../emoji/emoji'

const messages = defineMessages({
  emoji: { id: 'emoji_button.label', defaultMessage: 'Insert emoji' },
  emoji_search: { id: 'emoji_button.search', defaultMessage: 'Search...' },
  emoji_not_found: { id: 'emoji_button.not_found', defaultMessage: 'No emojos!! (╯°□°）╯︵ ┻━┻' },
  custom: { id: 'emoji_button.custom', defaultMessage: 'Custom' },
  recent: { id: 'emoji_button.recent', defaultMessage: 'Frequently used' },
  search_results: { id: 'emoji_button.search_results', defaultMessage: 'Search results' },
  people: { id: 'emoji_button.people', defaultMessage: 'People' },
  nature: { id: 'emoji_button.nature', defaultMessage: 'Nature' },
  food: { id: 'emoji_button.food', defaultMessage: 'Food & Drink' },
  activity: { id: 'emoji_button.activity', defaultMessage: 'Activity' },
  travel: { id: 'emoji_button.travel', defaultMessage: 'Travel & Places' },
  objects: { id: 'emoji_button.objects', defaultMessage: 'Objects' },
  symbols: { id: 'emoji_button.symbols', defaultMessage: 'Symbols' },
  flags: { id: 'emoji_button.flags', defaultMessage: 'Flags' },
})

const assetHost = process.env.CDN_HOST || ''
let EmojiPicker, Emoji // load asynchronously

const backgroundImageFn = () => `${assetHost}/emoji/sheet_10.png`
const listenerOptions = detectPassiveEvents.hasSupport ? { passive: true } : false

const categoriesSort = [
  'recent',
  'custom',
  'people',
  'nature',
  'foods',
  'activity',
  'places',
  'objects',
  'symbols',
  'flags',
];

class ModifierPickerMenu extends PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  handleClick = e => {
    this.props.onSelect(e.currentTarget.getAttribute('data-index') * 1);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.active) {
      this.attachListeners();
    } else {
      this.removeListeners();
    }
  }

  componentWillUnmount () {
    this.removeListeners();
  }

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  }

  attachListeners () {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  removeListeners () {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  }

  render () {
    const { active } = this.props;

    return (
      <div className='emoji-picker-dropdown__modifiers__menu' style={{ display: active ? 'block' : 'none' }} ref={this.setRef}>
        <button onClick={this.handleClick} data-index={1}>
          {/*<Emoji emoji='fist' set='twitter' size={22} sheetSize={32} skin={1} backgroundImageFn={backgroundImageFn} />*/}
        </button>
        {/*<button onClick={this.handleClick} data-index={2}>
          <Emoji emoji='fist' set='twitter' size={22} sheetSize={32} skin={2} backgroundImageFn={backgroundImageFn} />
        </button>
        <button onClick={this.handleClick} data-index={3}>
          <Emoji emoji='fist' set='twitter' size={22} sheetSize={32} skin={3} backgroundImageFn={backgroundImageFn} />
        </button>
        <button onClick={this.handleClick} data-index={4}>
          <Emoji emoji='fist' set='twitter' size={22} sheetSize={32} skin={4} backgroundImageFn={backgroundImageFn} />
        </button>
        <button onClick={this.handleClick} data-index={5}>
          <Emoji emoji='fist' set='twitter' size={22} sheetSize={32} skin={5} backgroundImageFn={backgroundImageFn} />
        </button>
        <button onClick={this.handleClick} data-index={6}>
          <Emoji emoji='fist' set='twitter' size={22} sheetSize={32} skin={6} backgroundImageFn={backgroundImageFn} />
    </button>*/}
      </div>
    );
  }

}

class ModifierPicker extends PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    modifier: PropTypes.number,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
  };

  handleClick = () => {
    if (this.props.active) {
      this.props.onClose();
    } else {
      this.props.onOpen();
    }
  }

  handleSelect = modifier => {
    this.props.onChange(modifier);
    this.props.onClose();
  }

  render () {
    const { active, modifier } = this.props;

    return (
      <div className='emoji-picker-dropdown__modifiers'>
        { /* <Emoji emoji='fist' set='twitter' size={22} sheetSize={32} skin={modifier} onClick={this.handleClick} backgroundImageFn={backgroundImageFn} /> */ }
        <ModifierPickerMenu active={active} onSelect={this.handleSelect} onClose={this.props.onClose} />
      </div>
    );
  }

}

@injectIntl
class EmojiPickerMenu extends ImmutablePureComponent {

  static propTypes = {
    custom_emojis: ImmutablePropTypes.list,
    frequentlyUsedEmojis: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onPick: PropTypes.func.isRequired,
    style: PropTypes.object,
    arrowOffsetLeft: PropTypes.string,
    arrowOffsetTop: PropTypes.string,
    intl: PropTypes.object.isRequired,
    skinTone: PropTypes.number.isRequired,
    onSkinTone: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: {},
    loading: true,
    frequentlyUsedEmojis: [],
  };

  state = {
    modifierOpen: false,
  };

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  }

  getI18n = () => {
    const { intl } = this.props;

    return {
      search: intl.formatMessage(messages.emoji_search),
      notfound: intl.formatMessage(messages.emoji_not_found),
      categories: {
        search: intl.formatMessage(messages.search_results),
        recent: intl.formatMessage(messages.recent),
        people: intl.formatMessage(messages.people),
        nature: intl.formatMessage(messages.nature),
        foods: intl.formatMessage(messages.food),
        activity: intl.formatMessage(messages.activity),
        places: intl.formatMessage(messages.travel),
        objects: intl.formatMessage(messages.objects),
        symbols: intl.formatMessage(messages.symbols),
        flags: intl.formatMessage(messages.flags),
        custom: intl.formatMessage(messages.custom),
      },
    };
  }

  handleClick = emoji => {
    if (!emoji.native) {
      emoji.native = emoji.colons;
    }

    this.props.onClose();
    this.props.onPick(emoji);
  }

  handleModifierOpen = () => {
    this.setState({ modifierOpen: true });
  }

  handleModifierClose = () => {
    this.setState({ modifierOpen: false });
  }

  handleModifierChange = modifier => {
    this.props.onSkinTone(modifier);
  }

  render () {
    const { loading, style, intl, custom_emojis, skinTone, frequentlyUsedEmojis } = this.props;

    if (loading) {
      return <div style={{ width: 299 }} />;
    }

    const title = intl.formatMessage(messages.emoji);
    const { modifierOpen } = this.state

    return (
      <div className={classNames('emoji-picker-dropdown__menu', { selecting: modifierOpen })} style={style} ref={this.setRef}>
        <EmojiPicker
          perLine={8}
          emojiSize={22}
          sheetSize={32}
          custom={buildCustomEmojis(custom_emojis)}
          color=''
          emoji=''
          set='twitter'
          title={title}
          i18n={this.getI18n()}
          onClick={this.handleClick}
          include={categoriesSort}
          recent={frequentlyUsedEmojis}
          skin={skinTone}
          showPreview={false}
          backgroundImageFn={backgroundImageFn}
          autoFocus
          emojiTooltip
        />

        <ModifierPicker
          active={modifierOpen}
          modifier={skinTone}
          onOpen={this.handleModifierOpen}
          onClose={this.handleModifierClose}
          onChange={this.handleModifierChange}
        />
      </div>
    );
  }

}

const perLine = 8
const lines = 2

const DEFAULTS = [
  '+1',
  'grinning',
  'kissing_heart',
  'heart_eyes',
  'laughing',
  'stuck_out_tongue_winking_eye',
  'sweat_smile',
  'joy',
  'yum',
  'disappointed',
  'thinking_face',
  'weary',
  'sob',
  'sunglasses',
  'heart',
  'ok_hand',
];

const getFrequentlyUsedEmojis = createSelector([
  state => state.getIn(['settings', 'frequentlyUsedEmojis'], ImmutableMap()),
], emojiCounters => {
  let emojis = emojiCounters
    .keySeq()
    .sort((a, b) => emojiCounters.get(a) - emojiCounters.get(b))
    .reverse()
    .slice(0, perLine * lines)
    .toArray();

  if (emojis.length < DEFAULTS.length) {
    let uniqueDefaults = DEFAULTS.filter(emoji => !emojis.includes(emoji));
    emojis = emojis.concat(uniqueDefaults.slice(0, DEFAULTS.length - emojis.length));
  }

  return emojis;
});

const getCustomEmojis = createSelector([
  state => state.get('custom_emojis'),
], emojis => emojis.filter(e => e.get('visible_in_picker')).sort((a, b) => {
  const aShort = a.get('shortcode').toLowerCase();
  const bShort = b.get('shortcode').toLowerCase();

  if (aShort < bShort) {
    return -1;
  } else if (aShort > bShort ) {
    return 1;
  }

  return 0;
}));

const mapStateToProps = state => ({
  custom_emojis: getCustomEmojis(state),
  skinTone: state.getIn(['settings', 'skinTone']),
  frequentlyUsedEmojis: getFrequentlyUsedEmojis(state),
});

const mapDispatchToProps = (dispatch, { onPickEmoji }) => ({
  onSkinTone: skinTone => {
    dispatch(changeSetting(['skinTone'], skinTone));
  },

  onPickEmoji: emoji => {
    dispatch(useEmoji(emoji));

    if (onPickEmoji) {
      onPickEmoji(emoji);
    }
  },
});

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class EmojiPickerPopover extends ImmutablePureComponent {

  static propTypes = {
    custom_emojis: ImmutablePropTypes.list,
    frequentlyUsedEmojis: PropTypes.arrayOf(PropTypes.string),
    intl: PropTypes.object.isRequired,
    onPickEmoji: PropTypes.func.isRequired,
    onSkinTone: PropTypes.func.isRequired,
    skinTone: PropTypes.number.isRequired,
  };

  state = {
    active: false,
    loading: false,
  };

  componentWillMount = () => {
    this.setState({ active: true });

    if (!EmojiPicker) {
      this.setState({ loading: true });

      EmojiPickerAsync().then(EmojiMart => {
        EmojiPicker = EmojiMart.Picker;
        Emoji       = EmojiMart.Emoji;

        this.setState({ loading: false });
      }).catch(() => {
        this.setState({ loading: false });
      });
    }
  }

  onHideDropdown = () => {
    this.setState({ active: false });
  }

  onToggle = (e) => {
    if (!this.state.loading && (!e.key || e.key === 'Enter')) {
      if (this.state.active) {
        this.onHideDropdown();
      } else {
        this.onShowDropdown(e);
      }
    }
  }

  handleKeyDown = e => {
    if (e.key === 'Escape') {
      this.onHideDropdown();
    }
  }

  render () {
    const {
      intl,
      onPickEmoji,
      onSkinTone,
      skinTone,
      frequentlyUsedEmojis
    } = this.props
    
    const { active, loading } = this.state;

    return (
      <div className='emoji-picker-dropdown' onKeyDown={this.handleKeyDown}>
        <EmojiPickerMenu
          custom_emojis={this.props.custom_emojis}
          loading={loading}
          onClose={this.onHideDropdown}
          onPick={onPickEmoji}
          onSkinTone={onSkinTone}
          skinTone={skinTone}
          frequentlyUsedEmojis={frequentlyUsedEmojis}
        />
      </div>
    );
  }

}
