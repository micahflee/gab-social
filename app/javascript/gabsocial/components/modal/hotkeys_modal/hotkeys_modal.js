import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import IconButton from '../../icon_button';

const messages = defineMessages({
  heading: { id: 'keyboard_shortcuts.heading', defaultMessage: 'Keyboard Shortcuts' },
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  hotkey: { id: 'keyboard_shortcuts.hotkey', defaultMessage: 'Hotkey' },
  reply: { id: 'keyboard_shortcuts.reply', defaultMessage: 'reply' },
  mention: { id: 'keyboard_shortcuts.mention', defaultMessage: 'mention author' },
  profile: { id: 'keyboard_shortcuts.profile', defaultMessage: 'open author\'s profile' },
  favourite: { id: 'keyboard_shortcuts.favourite', defaultMessage: 'favorite' },
  boost: { id: 'keyboard_shortcuts.boost', defaultMessage: 'repost' },
  enter: { id: 'keyboard_shortcuts.enter', defaultMessage: 'open status' },
  toggle_hidden: { id: 'keyboard_shortcuts.toggle_hidden', defaultMessage: 'show/hide text behind CW' },
  toggle_sensitivity: { id: 'keyboard_shortcuts.toggle_sensitivity', defaultMessage: 'show/hide media' },
  up: { id: 'keyboard_shortcuts.up', defaultMessage: 'move up in the list' },
  down: { id: 'keyboard_shortcuts.down', defaultMessage: 'move down in the list' },
  column: { id: 'keyboard_shortcuts.column', defaultMessage: 'focus a status in one of the columns' },
  compose: { id: 'keyboard_shortcuts.compose', defaultMessage: 'focus the compose textarea' },
  gab: { id: 'keyboard_shortcuts.toot', defaultMessage: 'start a brand new gab' },
  back: { id: 'keyboard_shortcuts.back', defaultMessage: 'navigate back' },
  search: { id: 'keyboard_shortcuts.search', defaultMessage: 'focus search' },
  unfocus: { id: 'keyboard_shortcuts.unfocus', defaultMessage: 'un-focus compose textarea/search' },
  home: { id: 'keyboard_shortcuts.home', defaultMessage: 'open home timeline' },
  notifications: { id: 'keyboard_shortcuts.notifications', defaultMessage: 'open notifications column' },
  direct: { id: 'keyboard_shortcuts.direct', defaultMessage: 'open direct messages column' },
  start: { id: 'keyboard_shortcuts.start', defaultMessage: 'open "get started" column' },
  favourites: { id: 'keyboard_shortcuts.favourites', defaultMessage: 'open favorites list' },
  pinned: { id: 'keyboard_shortcuts.pinned', defaultMessage: 'open pinned gabs list' },
  my_profile: { id: 'keyboard_shortcuts.my_profile', defaultMessage: 'open your profile' },
  blocked: { id: 'keyboard_shortcuts.blocked', defaultMessage: 'open blocked users list' },
  muted: { id: 'keyboard_shortcuts.muted', defaultMessage: 'open muted users list' },
  requests: { id: 'keyboard_shortcuts.requests', defaultMessage: 'open follow requests list' },
  legend: { id: 'keyboard_shortcuts.legend', defaultMessage: 'display this legend' },
});

export default @injectIntl
class HotkeysModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render () {
    const { intl, onClose } = this.props;

    return (
      <div className='modal-root__modal hotkeys-modal'>
        <div className='keyboard-shortcuts'>
          <div className='keyboard-shortcuts__header'>
            <h3 className='keyboard-shortcuts__header__title'>
              {intl.formatMessage(messages.heading)}
            </h3>
            <IconButton
              className='keyboard-shortcuts__close'
              title={intl.formatMessage(messages.close)}
              icon='times'
              onClick={onClose}
              size={20}
            />
          </div>
          <div className='keyboard-shortcuts__content'>
            <table>
              <thead>
                <tr>
                  <th>{intl.formatMessage(messages.hotkey)}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><kbd>r</kbd></td>
                  <td>{intl.formatMessage(messages.reply)}</td>
                </tr>
                <tr>
                  <td><kbd>m</kbd></td>
                  <td>{intl.formatMessage(messages.mention)}</td>
                </tr>
                <tr>
                  <td><kbd>p</kbd></td>
                  <td>{intl.formatMessage(messages.profile)}</td>
                </tr>
                <tr>
                  <td><kbd>f</kbd></td>
                  <td>{intl.formatMessage(messages.favourite)}</td>
                </tr>
                <tr>
                  <td><kbd>b</kbd></td>
                  <td>{intl.formatMessage(messages.boost)}</td>
                </tr>
                <tr>
                  <td><kbd>enter</kbd>, <kbd>o</kbd></td>
                  <td>{intl.formatMessage(messages.enter)}</td>
                </tr>
                <tr>
                  <td><kbd>x</kbd></td>
                  <td>{intl.formatMessage(messages.toggle_hidden)}</td>
                </tr>
                <tr>
                  <td><kbd>h</kbd></td>
                  <td>{intl.formatMessage(messages.toggle_sensitivity)}</td>
                </tr>
                <tr>
                  <td><kbd>up</kbd>, <kbd>k</kbd></td>
                  <td>{intl.formatMessage(messages.up)}</td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>{intl.formatMessage(messages.hotkey)}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><kbd>down</kbd>, <kbd>j</kbd></td>
                  <td>{intl.formatMessage(messages.down)}</td>
                </tr>
                <tr>
                  <td><kbd>1</kbd> - <kbd>9</kbd></td>
                  <td>{intl.formatMessage(messages.column)}</td>
                </tr>
                <tr>
                  <td><kbd>n</kbd></td>
                  <td>{intl.formatMessage(messages.compose)}</td>
                </tr>
                <tr>
                  <td><kbd>alt</kbd> + <kbd>n</kbd></td>
                  <td>{intl.formatMessage(messages.gab)}</td>
                </tr>
                <tr>
                  <td><kbd>backspace</kbd></td>
                  <td>{intl.formatMessage(messages.back)}</td>
                </tr>
                <tr>
                  <td><kbd>s</kbd></td>
                  <td>{intl.formatMessage(messages.search)}</td>
                </tr>
                <tr>
                  <td><kbd>esc</kbd></td>
                  <td>{intl.formatMessage(messages.unfocus)}</td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>h</kbd></td>
                  <td>{intl.formatMessage(messages.home)}</td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>n</kbd></td>
                  <td>{intl.formatMessage(messages.notifications)}</td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>d</kbd></td>
                  <td>{intl.formatMessage(messages.direct)}</td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>{intl.formatMessage(messages.hotkey)}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><kbd>g</kbd> + <kbd>s</kbd></td>
                  <td>{intl.formatMessage(messages.start)}</td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>f</kbd></td>
                  <td>{intl.formatMessage(messages.favourites)}</td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>p</kbd></td>
                  <td>{intl.formatMessage(messages.pinned)}</td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>u</kbd></td>
                  <td>{intl.formatMessage(messages.my_profile)}</td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>b</kbd></td>
                  <td>{intl.formatMessage(messages.blocked)}</td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>m</kbd></td>
                  <td>{intl.formatMessage(messages.muted)}</td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>r</kbd></td>
                  <td>{intl.formatMessage(messages.requests)}</td>
                </tr>
                <tr>
                  <td><kbd>?</kbd></td>
                  <td>{intl.formatMessage(messages.legend)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

}
