import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Sticky from 'react-stickynode'
import Sidebar from '../components/sidebar'
import Search from '../components/search'
import Image from '../components/image'
import Text from '../components/text'
import Button from '../components/button'
import DisplayName from '../components/display_name'
import TabBar from '../components/tab_bar'
import Block from '../components/block'
import ColumnHeader from '../components/column_header'

export default class GroupLayout extends ImmutablePureComponent {
  static propTypes = {
    actions: PropTypes.array,
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
    layout: PropTypes.object,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const { group, children, layout, showBackBtn, actions, relationships } = this.props

    const tabs = !group ? null : [
      {
        to: `/groups/${group.get('id')}`,
        title: 'Latest',
      },
      {
        to: `/groups/${group.get('id')}/pinned`,
        title: 'Pinned',
      },
      {
        to: `/groups/${group.get('id')}/popular`,
        title: 'Popular',
      },
    ]

    const title = !!group ? group.get('title') : undefined

    console.log("relationships:", relationships)
    // const !!relationships && relationships.get('member')

    return (
      <div className={[_s.default, _s.flexRow, _s.width100PC, _s.heightMin100VH, _s.backgroundColorSecondary3].join(' ')}>

        <Sidebar />

        <main role='main' className={[_s.default, _s.flexShrink1, _s.flexGrow1, _s.borderColorSecondary2, _s.borderLeft1PX].join(' ')}>

          <div className={[_s.default, _s.height53PX, _s.borderBottom1PX, _s.borderColorSecondary2, _s.backgroundColorSecondary3, _s.z3, _s.top0, _s.positionFixed].join(' ')}>
            <div className={[_s.default, _s.height53PX, _s.paddingLeft15PX, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
              <div className={[_s.default, _s.width645PX].join(' ')}>
                <ColumnHeader
                  title={title}
                  showBackBtn={showBackBtn}
                  actions={actions}
                  tabs={tabs}
                />
              </div>
              <div className={[_s.default, _s.width340PX].join(' ')}>
                <Search />
              </div>
            </div>
          </div>

          <div className={[_s.default, _s.height53PX].join(' ')}></div>

          <div className={[_s.default, _s.width1015PX, _s.paddingLeft15PX, _s.paddingVertical15PX].join(' ')}>

            <div className={[_s.default, _s.z1, _s.width100PC, _s.marginBottom15PX].join(' ')}>
              <Block>
                <div className={[_s.default, _s.width100PC].join(' ')}>
                  <Image className={_s.height350PX} src='https://gab.com/media/user/bz-5cf53d08403d4.jpeg' />
                  <div className={[_s.default, _s.height53PX, _s.width100PC].join(' ')}>
                    <div className={[_s.default, _s.flexRow, _s.height100PC, _s.paddingHorizontal10PX].join(' ')}>
                      <TabBar tabs={tabs} />
                      <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.height100PC, _s.marginLeftAuto].join(' ')}>
                        <Button
                          color='primary'
                          backgroundColor='tertiary'
                          radiusSmall
                          className={_s.marginRight5PX}
                        >
                          <Text color='inherit' size='small'>
                            Leave/Join
                          </Text>
                        </Button>
                        <Button
                          color='primary'
                          backgroundColor='tertiary'
                          radiusSmall
                          className={_s.marginRight5PX}
                        >
                          <Text color='inherit' size='small'>
                            Share
                          </Text>
                        </Button>
                        <Button
                          radiusSmall
                          color='primary'
                          backgroundColor='tertiary'
                          className={_s.marginRight5PX}
                          icon='ellipsis'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Block>
            </div>

            <div className={[_s.default, _s.flexRow, _s.width100PC, _s.justifyContentSpaceBetween].join(' ')}>
              <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>
                <div className={_s.default}>
                  {children}
                </div>
              </div>

              <div className={[_s.default, _s.width340PX].join(' ')}>
                <Sticky top={73} enabled>
                  <div className={[_s.default, _s.width340PX].join(' ')}>
                    {layout}
                  </div>
                </Sticky>
              </div>
            </div>

          </div>

        </main>

      </div>
    )
  }

}
