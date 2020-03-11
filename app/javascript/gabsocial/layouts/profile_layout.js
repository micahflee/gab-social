import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Sticky from 'react-stickynode'
import Sidebar from '../components/sidebar'
import Image from '../components/image'
import Text from '../components/text'
import Button from '../components/button'
import DisplayName from '../components/display_name'
import TabBar from '../components/tab_bar'

export default class ProfileLayout extends ImmutablePureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map,
    layout: PropTypes.object,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const { account, children, layout } = this.props

    const tabs = !account ? null : [
      {
        to: `/${account.get('acct')}`,
        title: 'Timeline',
      },
      {
        to: `/${account.get('acct')}/comments`,
        title: 'Comments',
      },
      {
        to: `/${account.get('acct')}/media`,
        title: 'Media',
      },
      {
        to: '',
        title: 'More',
      },
    ]

    return (
      <div className={[_s.default, _s.flexRow, _s.width100PC, _s.heightMin100VH, _s.backgroundColorSecondary3].join(' ')}>

        <Sidebar />

        <main role='main' className={[_s.default, _s.flexShrink1, _s.flexGrow1, _s.borderColorSecondary2, _s.borderLeft1PX].join(' ')}>

          <div className={[_s.default, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween, _s.pl15, _s.py15].join(' ')}>
            <div className={[_s.default, _s.z1, _s.width100PC].join(' ')}>
              <div className={[_s.default, _s.height350PX, _s.width100PC, _s.radiusSmall, _s.overflowHidden].join(' ')}>
                <Image className={_s.height350PX} src={account.get('header')} />
              </div>

              <div className={[_s.default, _s.borderBottom1PX, _s.borderColorSecondary, _s.width100PC].join(' ')}>
                <div className={[_s.default, _s.flexRow, _s.px15].join(' ')}>
                  <Image
                    className={[_s.circle, _s.marginTopNeg75PX, _s.borderColorWhite, _s.border2PX].join(' ')}
                    height='150px'
                    width='150px'
                    src={account.get('avatar')}
                  />
                  <div className={[_s.default, _s.px15, _s.py10].join(' ')}>
                    <DisplayName account={account} multiline large />
                  </div>
                </div>

                <div className={[_s.default, _s.flexRow, _s.borderBottom1PX, _s.borderColorSecondary, _s.mt5, _s.height53PX].join(' ')}>
                  <div className={[_s.default].join(' ')}>
                    <TabBar tabs={tabs} large />
                  </div>
                  <div className={[_s.default, _s.flexRow, _s.marginLeftAuto, _s.py5].join(' ')}>
                    <Button
                      outline
                      icon='ellipsis'
                      iconWidth='18px'
                      iconHeight='18px'
                      iconClassName={_s.fillColorBrand}
                      color='brand'
                      backgroundColor='none'
                      className={[_s.justifyContentCenter, _s.alignItemsCenter, _s.mr10, _s.px10].join(' ')}
                    />
                    <Button
                      outline
                      icon='chat'
                      iconWidth='18px'
                      iconHeight='18px'
                      iconClassName={_s.fillColorBrand}
                      color='brand'
                      backgroundColor='none'
                      className={[_s.justifyContentCenter, _s.alignItemsCenter, _s.mr10, _s.px10].join(' ')}
                    />
                    <Button
                      className={[_s.justifyContentCenter, _s.alignItemsCenter].join(' ')}
                    >
                      <span className={[_s.px15].join(' ')}>
                        <Text
                          color='white'
                          weight='bold'
                          size='medium'
                          className={[_s.px15].join(' ')}
                        >
                          Follow
                        </Text>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className={[_s.default, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween, _s.pr15, _s.py15].join(' ')}>
                <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>
                  <div className={_s.default}>
                    {children}
                  </div>
                </div>

                <div className={[_s.default, _s.width340PX].join(' ')}>
                  <Sticky top={15} enabled>
                    <div className={[_s.default, _s.width340PX].join(' ')}>
                      {layout}
                    </div>
                  </Sticky>
                </div>
              </div>
            </div>
          </div>

        </main>

      </div>
    )
  }

}
