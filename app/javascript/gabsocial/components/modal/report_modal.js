import { defineMessages, injectIntl } from 'react-intl'
import { OrderedSet } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { changeReportComment, changeReportForward, submitReport } from '../../actions/reports'
import { expandAccountTimeline } from '../../actions/timelines'
import { makeGetAccount } from '../../selectors'
import ModalLayout from './modal_layout'
import Button from '../button'
import StatusCheckBox from '../status_check_box'
import Switch from '../switch'
import Text from '../Text'
import Textarea from '../Textarea'

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  placeholder: { id: 'report.placeholder', defaultMessage: 'Additional comments' },
  submit: { id: 'report.submit', defaultMessage: 'Submit' },
  hint: { id: 'report.hint', defaultMessage: 'The report will be sent to your server moderators. You can provide an explanation of why you are reporting this account below:' },
  forwardHint: { id: 'report.forward_hint', defaultMessage: 'The account is from another server. Send an anonymized copy of the report there as well?' },
  forward: { id: 'report.forward', defaultMessage: 'Forward to {target}' },
  target: { id: 'report.target', defaultMessage: 'Report {target}' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = state => {
    const accountId = state.getIn(['reports', 'new', 'account_id']);

    return {
      isSubmitting: state.getIn(['reports', 'new', 'isSubmitting']),
      account: getAccount(state, accountId),
      comment: state.getIn(['reports', 'new', 'comment']),
      forward: state.getIn(['reports', 'new', 'forward']),
      statusIds: OrderedSet(state.getIn(['timelines', `account:${accountId}:with_replies`, 'items'])).union(state.getIn(['reports', 'new', 'status_ids'])),
    };
  };

  return mapStateToProps;
};

export default
@connect(makeMapStateToProps)
@injectIntl
class ReportModal extends ImmutablePureComponent {

  static propTypes = {
    isSubmitting: PropTypes.bool,
    account: ImmutablePropTypes.map,
    statusIds: ImmutablePropTypes.orderedSet.isRequired,
    comment: PropTypes.string.isRequired,
    forward: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleCommentChange = e => {
    this.props.dispatch(changeReportComment(e.target.value));
  }

  handleForwardChange = e => {
    this.props.dispatch(changeReportForward(e.target.checked));
  }

  handleSubmit = () => {
    this.props.dispatch(submitReport());
  }

  handleKeyDown = e => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit();
    }
  }

  componentDidMount () {
    this.props.dispatch(expandAccountTimeline(this.props.account.get('id'), { withReplies: true }));
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.account !== nextProps.account && nextProps.account) {
      this.props.dispatch(expandAccountTimeline(nextProps.account.get('id'), { withReplies: true }));
    }
  }

  render () {
    const {
      account, 
      comment,
      intl,
      statusIds,
      isSubmitting,
      forward,
      onClose
    } = this.props

    if (!account) return null

    const domain = account.get('acct').split('@')[1];

    return (
      <ModalLayout
        noPadding
        title={intl.formatMessage(messages.target, {
          target: account.get('acct')
        })}
      >

        <div className={[_s.default, _s.flexRow].join(' ')}>
          <div className={[_s.default, _s.width50PC, _s.py10, _s.px15, _s.borderRight1PX, _s.borderColorSecondary].join(' ')}>
            <Text color='secondary' size='small'>
              {intl.formatMessage(messages.hint)}
            </Text>

            <div className={_s.my10}>
              <Textarea
                placeholder={intl.formatMessage(messages.placeholder)}
                value={comment}
                onChange={this.handleCommentChange}
                onKeyDown={this.handleKeyDown}
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            {
              domain &&
              <div>
                <Text color='secondary' size='small'>
                  {intl.formatMessage(messages.forwardHint)}
                </Text>

                <div className='setting-toggle'>
                  <Switch 
                    id='report-forward'
                    checked={forward}
                    disabled={isSubmitting}
                    onChange={this.handleForwardChange}
                    label={intl.formatMessage(messages.forward, {
                      target: domain,
                    })}
                    labelProps={{
                      size: 'small',
                      color: 'secondary',
                    }}
                  />
                </div>
              </div>
            }
            
            <Button
              disabled={isSubmitting}
              onClick={this.handleSubmit}
              className={_s.marginTopAuto}
            >
              {intl.formatMessage(messages.submit)}
            </Button>
          </div>

          <div className={[_s.default, _s.width50PC].join(' ')}>
            <div className={[_s.default, _s.heightMax80VH, _s.overflowYScroll, _s.pr15, _s.py10].join(' ')}>
              {
                statusIds.map(statusId => (
                  <StatusCheckBox id={statusId} key={statusId} disabled={isSubmitting} />
                ))
              }
            </div>
          </div>
        </div>
      </ModalLayout>
    );
  }

}
