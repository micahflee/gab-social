import React from 'react'
import PropTypes from 'prop-types'
import Button from './button'
import Heading from './heading'
import Icon from './icon'
import Text from './text'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'

export default class GlobalFooter extends React.PureComponent {

  render() {

    return (
      <div className={[_s.default, _s.z4, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.left0, _s.right0, _s.bottom0, _s.width100PC, _s.bgSubtle, _s.borderTop1PX, _s.alignItemsCenter, _s.borderColorSecondary].join(' ')}>

          <div className={[_s.default, _s.mt15, _s.mb15].join(' ')}>
            <ResponsiveClassesComponent
              classNames={[_s.default, _s.width1255PX, _s.flexRow, _s.py15, _s.mt15, _s.mb15].join(' ')}
              classNamesSmall={[_s.default, _s.width1255PX, _s.alignItemsCenter, _s.pt15, _s.px15, _s.mt15].join(' ')}
            >

              <ResponsiveClassesComponent
                classNames={[_s.default, _s.width330PX].join(' ')}
                classNamesSmall={[_s.default, _s.alignItemsCenter].join(' ')}
              >
                <div className={[_s.default, _s.mb10].join(' ')}>
                  <Icon id='logo' />
                </div>
                <div className={[_s.default, _s.pr15, _s.maxWidth640PX].join(' ')}>
                  <Text size='medium'>We build Freedom Of Speech Software. We champion free speech, individual liberty and the free flow of information online. All are welcome.</Text>
                </div>
              </ResponsiveClassesComponent>

              <ResponsiveClassesComponent
                classNames={[_s.default, _s.flexRow, _s.flexGrow1, _s.pl15].join(' ')}
                classNamesSmall={[_s.default, _s.py15, _s.width100PC, _s.px15].join(' ')}
              >

                <GlobalFooterColumn
                  title='Join'
                  items={[
                    {
                      href: 'https://gab.com',
                      title: 'Gab Social',
                    },
                    {
                      href: 'https://dissenter.com',
                      title: 'Dissenter Browser',
                    },
                    {
                      href: 'https://chat.gab.com',
                      title: 'Gab Chat',
                    },
                  ]}
                />

                <GlobalFooterColumn
                  title='Stay Informed'
                  items={[
                    {
                      href: 'https://trends.gab.com',
                      title: 'Gab Trends',
                    },
                    {
                      href: 'https://news.gab.com',
                      title: 'Gab News',
                    },
                    {
                      href: 'https://apps.gab.com',
                      title: 'Gab Apps',
                    },
                  ]}
                />

                <GlobalFooterColumn
                  title='Support Us'
                  items={[
                    {
                      href: 'https://pro.gab.com',
                      title: 'Go PRO',
                    },
                    {
                      href: 'https://shop.dissenter.com',
                      title: 'Merch Store',
                    },
                    {
                      href: 'https://news.gab.com/support-gab',
                      title: 'Affiliates',
                    },
                  ]}
                />

                <GlobalFooterColumn
                  title='Legal'
                  items={[
                    {
                      to: '/about/tos',
                      title: 'Terms of Service',
                    },
                    {
                      to: '/about/privacy',
                      title: 'Privacy Policy',
                    },
                    {
                      to: '/about/dmca',
                      title: 'Copyright Policy',
                    },
                    {
                      href: 'https://help.gab.com',
                      title: 'Contact Us',
                    },
                  ]}
                />

              </ResponsiveClassesComponent>
            </ResponsiveClassesComponent>
          </div>

          <div className={[_s.default, _s.alignItemsCenter, _s.bgSecondary, _s.height100PC, _s.heightMin58PX, _s.width100PC, _s.saveAreaInsetPB, _s.justifyContentSpaceAround].join(' ')}>
            <ResponsiveClassesComponent
              classNames={[_s.default, _s.width1255PX, _s.flexRow, _s.alignItemsCenter].join(' ')}
              classNamesXS={[_s.default, _s.width1255PX, _s.alignItemsCenter, _s.px15, _s.pt15].join(' ')}
            >

              <div classNames={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
                <Text weight='bold'>
                  © 2020
                </Text>
                <Text>
                  &nbsp;Copyright |&nbsp;
                </Text>
                <Button
                  isText
                  color='primary'
                  backgroundColor='none'
                  className={_s.displayInline}
                  href='https://gab.com'
                >
                  <Text>Gab AI Inc.</Text>
                </Button>
              </div>
                
              <ResponsiveClassesComponent
                classNames={[_s.default, _s.alignItemsCenter, _s.mlAuto].join(' ')}
                classNamesXS={[_s.default, _s.alignItemsCenter, _s.py15].join(' ')}
              >
                <Text>
                  Made in USA 🇺🇸
                </Text>
              </ResponsiveClassesComponent>

            </ResponsiveClassesComponent>
          </div>

        </div>
      </div>
    )
  }

}

class GlobalFooterColumn extends React.PureComponent {

  static propTypes = {
    title: PropTypes.string,
    items: PropTypes.array,
  }

  componentWillMount() {
    this.buttonOptions = {
      backgroundColor: 'none',
      color: 'primary',
      isText: true,
    }
  }

  render() {
    const { title, items } = this.props
    const { buttonOptions } = this

    return (
      <ResponsiveClassesComponent
        classNames={[_s.default, _s.flexNormal].join(' ')}
        classNamesSmall={[_s.default, _s.width100PC, _s.alignItemsCenter, _s.mt15, _s.mb5, _s.pt15, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}
      >
        <div className={_s.mb10}>
          <Heading size='h3'>{title}</Heading>
        </div>
        {
          items.map((item, i) => (
            <Button {...buttonOptions} to={item.to} href={item.href} key={`global-footer-column-${title}-${i}`}>
              <Text color='secondary' className={[_s.lineHeight15, _s.pt2].join(' ')}>{item.title}</Text>
            </Button>
          ))
        }
      </ResponsiveClassesComponent>
    )

  }

}