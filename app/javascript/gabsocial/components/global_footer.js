import React from 'react'
import PropTypes from 'prop-types'
import Button from './button'
import Heading from './heading'
import Icon from './icon'
import Text from './text'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'

const GlobalFooter = () => (
  <div className={[_s.d, _s.z3, _s.w100PC].join(' ')}>
    <div className={[_s.d, _s.left0, _s.right0, _s.bottom0, _s.w100PC, _s.bgSubtle, _s.borderTop1PX, _s.aiCenter, _s.borderColorSecondary].join(' ')}>

      <div className={[_s.d, _s.mt15, _s.mb15].join(' ')}>
        <ResponsiveClassesComponent
          classNames={[_s.d, _s.w1255PX, _s.flexRow, _s.py15, _s.mt15, _s.mb15].join(' ')}
          classNamesSmall={[_s.d, _s.w1255PX, _s.aiCenter, _s.pt15, _s.px15, _s.mt15].join(' ')}
        >

          <ResponsiveClassesComponent
            classNames={[_s.d, _s.w330PX].join(' ')}
            classNamesSmall={[_s.d, _s.aiCenter].join(' ')}
          >
            <div className={[_s.d, _s.mb10].join(' ')}>
              <Icon id='logo' />
            </div>
            <div className={[_s.d, _s.pr15, _s.maxW640PX].join(' ')}>
              <Text size='medium'>We build Freedom Of Speech Software. We champion free speech, individual liberty and the free flow of information online. All are welcome.</Text>
            </div>
          </ResponsiveClassesComponent>

          <ResponsiveClassesComponent
            classNames={[_s.d, _s.flexRow, _s.flexGrow1, _s.pl15].join(' ')}
            classNamesSmall={[_s.d, _s.py15, _s.w100PC, _s.px15].join(' ')}
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

      <div className={[_s.d, _s.aiCenter, _s.bgSecondary, _s.h100PC, _s.minH58PX, _s.w100PC, _s.saveAreaInsetPB, _s.jcSpaceAround].join(' ')}>
        <ResponsiveClassesComponent
          classNames={[_s.d, _s.w1255PX, _s.flexRow, _s.aiCenter].join(' ')}
          classNamesXS={[_s.d, _s.w1255PX, _s.aiCenter, _s.px15, _s.pt15, _s.pb50].join(' ')}
        >

          <div classNames={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
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
            classNames={[_s.d, _s.aiCenter, _s.mlAuto].join(' ')}
            classNamesXS={[_s.d, _s.aiCenter, _s.py15].join(' ')}
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

class GlobalFooterColumn extends React.PureComponent {

  render() {
    const { title, items } = this.props

    return (
      <ResponsiveClassesComponent
        classNames={[_s.d, _s.flexNormal].join(' ')}
        classNamesSmall={[_s.d, _s.w100PC, _s.aiCenter, _s.mt15, _s.mb5, _s.pt15, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}
      >
        <div className={_s.mb10}>
          <Heading size='h3'>{title}</Heading>
        </div>
        {
          items.map((item, i) => (
            <Button backgroundColor='none' color='primary' isText to={item.to} href={item.href} key={`global-footer-column-${title}-${i}`}>
              <Text color='secondary' className={[_s.lineHeight15, _s.pt2].join(' ')}>{item.title}</Text>
            </Button>
          ))
        }
      </ResponsiveClassesComponent>
    )

  }

}

GlobalFooterColumn.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
}

export default GlobalFooter