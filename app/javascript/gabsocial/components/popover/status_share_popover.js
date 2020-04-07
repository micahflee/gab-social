import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  embed: { id: 'status.embed', defaultMessage: 'Embed gab' },
  email: { id: 'status.email', defaultMessage: 'Email gab' },
  copy: { id: 'status.copy', defaultMessage: 'Copy link to gab' },
});

// const makeMapStateToProps = () => {
//   const getAccount = makeGetAccount();

//   const mapStateToProps = (state, { account }) => ({
    
//   });

//   return mapStateToProps;
// };

// const mapDispatchToProps = (dispatch, { intl }) => ({

// });

// : todo :

export default
@injectIntl
// @connect(makeMapStateToProps, mapDispatchToProps)
class StatusSharePopover extends ImmutablePureComponent {
  static propTypes = {
    status: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  }

  handleEmbed = () => {
    // this.props.onEmbed(this.props.status);
  }

  handleCopy = () => {
    // const url = this.props.status.get('url');
    // const textarea = document.createElement('textarea');

    // textarea.textContent = url;
    // textarea.style.position = 'fixed';

    // document.body.appendChild(textarea);

    // try {
    //   textarea.select();
    //   document.execCommand('copy');
    // } catch (e) {
    //   //
    // } finally {
    //   document.body.removeChild(textarea);
    // }
  }

  render() {
    const { intl } = this.props

    return (
      <PopoverLayout width={220}>
        <List
          size='large'
          scrollKey='status_share_options'
          items={[
            {
              icon: 'copy',
              hideArrow: true,
              title: intl.formatMessage(messages.copy),
              onClick: this.handleCopy,
            },
            {
              icon: 'email',
              hideArrow: true,
              title: intl.formatMessage(messages.email),
              href: 'mailto:',
            },
            {
              icon: 'code',
              hideArrow: true,
              title: intl.formatMessage(messages.embed),
              onClick: this.handleEmbed,
            },
          ]}
          small
        />
      </PopoverLayout>
    )
  }
}