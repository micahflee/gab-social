import React from 'react'
import PropTypes from 'prop-types'
import Block from '../block'
import Heading from '../heading'
import Button from '../button'
import Text from '../text'

export default class PanelLayout extends React.PureComponent {

  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.node,
    headerButtonTitle: PropTypes.string,
    headerButtonAction: PropTypes.func,
    headerButtonTo: PropTypes.string,
    footerButtonTitle: PropTypes.string,
    footerButtonAction: PropTypes.func,
    footerButtonTo: PropTypes.string,
    footerButtonHref: PropTypes.string,
    noPadding: PropTypes.bool,
  }

  render() {
    const {
      title,
      subtitle,
      headerButtonTitle,
      headerButtonAction,
      headerButtonTo,
      footerButtonTitle,
      footerButtonAction,
      footerButtonTo,
      footerButtonHref,
      noPadding,
      children,
    } = this.props

    return (
      <aside className={[_s._, _s.mb15].join(' ')}>
        <Block>
          {
            (title || subtitle) &&
            <div className={[_s._, _s.px15, _s.py10].join(' ')}>
              <div className={[_s._, _s.flexRow, _s.aiCenter].join(' ')}>
                <Heading size='h2'>
                  {title}
                </Heading>
                {
                  (!!headerButtonTitle && (!!headerButtonAction || !!headerButtonTo)) &&
                  <div className={[_s._, _s.mlAuto].join(' ')}>
                    <Button
                      isText
                      backgroundColor='none'
                      color='brand'
                      to={headerButtonTo}
                      onClick={headerButtonAction}
                    >
                      <Text size='small' color='inherit' weight='bold'>
                        {headerButtonTitle}
                      </Text>
                    </Button>
                  </div>
                }
              </div>
              {
                subtitle &&
                <Heading size='h4'>
                  {subtitle}
                </Heading>
              }
            </div>
          }

          {
            !noPadding &&
            <div className={[_s._, _s.px15, _s.py10].join(' ')}>
              {children}
            </div>
          }

          {
            noPadding && children
          }

          {
            (!!footerButtonTitle && (!!footerButtonAction || !!footerButtonTo || !!footerButtonHref)) &&
            <div className={_s._}>
              <Button
                isText
                color='none'
                backgroundColor='none'
                to={footerButtonTo}
                href={footerButtonHref}
                onClick={footerButtonAction}
                className={[_s.px15, _s.py15, _s.bgSubtle_onHover].join(' ')}
              >
                <Text color='brand' size='medium'>
                  {footerButtonTitle}
                </Text>
              </Button>
            </div>
          }
        </Block>
      </aside>
    )
  }

}