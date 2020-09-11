import React from 'react'
import Block from '../../components/block'
import Button from '../../components/button'
import Icon from '../../components/icon'
import Divider from '../../components/divider'
import Heading from '../../components/heading'
import Text from '../../components/text'
import GabLogo from '../../components/logo'

export default class Assets extends React.PureComponent {

  render() {

    return (
      <div className={[_s.default].join(' ')}>
        <Block>
          <div className={[_s.default, _s.px15, _s.py15, _s.mb10].join(' ')}>
            <Heading>Gab Assets</Heading>
            
            <div className={[_s.d, _s.mt15, _s.pt10, _s.pb15, _s.w100PC].join(' ')}>
              <Heading size='h2'>Gab brand colors</Heading>

              <div className={[_s.d, _s.mt15, _s.w100PC].join(' ')}>

                <div className={[_s.d, _s.mt15, _s.flexRow, _s.flexWrap].join(' ')}>
                  <div className={[_s.d, _s.px15, _s.aiCenter].join(' ')}>
                    <div className={[_s.d, _s.h40PX, _s.w40PX, _s.circle, _s.bgBrand].join(' ')} />
                    <div className={[_s.d, _s.py10, _s.aiCenter].join(' ')}>
                      <Text weight='medium' size='medium' className={_s.pb10}>Gab Brand Green</Text>
                      <Text color='secondary' className={_s.lineHeight15}>#30CE7D</Text>
                      <Text color='secondary'>rgb(48, 206, 125)</Text>
                    </div>
                  </div>

                  <div className={[_s.d, _s.px15, _s.aiCenter].join(' ')}>
                    <div className={[_s.d, _s.h40PX, _s.w40PX, _s.circle, _s.bgPro].join(' ')} />
                    <div className={[_s.d, _s.py10, _s.aiCenter].join(' ')}>
                      <Text weight='medium' size='medium' className={_s.pb10}>GabPRO Gold</Text>
                      <Text color='secondary' className={_s.lineHeight15}>#FED631</Text>
                      <Text color='secondary'>rgb(254, 214, 49)</Text>
                    </div>
                  </div>
                </div>

                <div className={[_s.d, _s.mt15, _s.flexRow, _s.flexWrap].join(' ')}>
                  <div className={[_s.d, _s.px15, _s.aiCenter].join(' ')}>
                    <div className={[_s.d, _s.h40PX, _s.w40PX, _s.circle, _s.border1PX, _s.bgWhite].join(' ')} />
                    <div className={[_s.d, _s.py10, _s.aiCenter].join(' ')}>
                      <Text weight='medium' size='medium' className={_s.pb10}>White</Text>
                      <Text color='secondary' className={_s.lineHeight15}>#FFFFFF</Text>
                      <Text color='secondary'>rgb(255, 255, 255)</Text>
                    </div>
                  </div>

                  <div className={[_s.d, _s.px15, _s.aiCenter].join(' ')}>
                    <div className={[_s.d, _s.h40PX, _s.w40PX, _s.circle, _s.bgBlack].join(' ')} />
                    <div className={[_s.d, _s.py10, _s.aiCenter].join(' ')}>
                      <Text weight='medium' size='medium' className={_s.pb10}>Black</Text>
                      <Text color='secondary' className={_s.lineHeight15}>#000</Text>
                      <Text color='secondary'>rgb(0, 0, 0)</Text>
                    </div>
                  </div>

                  <div className={[_s.d, _s.px15, _s.aiCenter].join(' ')}>
                    <div
                      className={[_s.d, _s.h40PX, _s.w40PX, _s.circle].join(' ')}
                      style={{
                        backgroundColor: '#222'
                      }}
                    />
                    <div className={[_s.d, _s.py10, _s.aiCenter].join(' ')}>
                      <Text weight='medium' size='medium' className={_s.pb10}>Muted</Text>
                      <Text color='secondary' className={_s.lineHeight15}>#222222</Text>
                      <Text color='secondary'>rgb(34, 34, 34)</Text>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <Divider />

            <div className={[_s.d, _s.mt15, _s.pt10, _s.pb15, _s.w100PC].join(' ')}>
              <Heading size='h2'>Gab logo</Heading>

              <div className={[_s.d, _s.mt15, _s.flexRow, _s.flexWrap, _s.w100PC].join(' ')}>
                <div className={[_s.d, _s.px15, _s.aiCenter, _s.jcCenter, _s.flexRow, _s.mt10].join(' ')}>
                  <GabLogo />
                  <div className={[_s.d, _s.pl10, _s.ml15].join(' ')}>
                    <Button>
                      Download Logo
                    </Button>
                  </div>
                </div>
              </div>

            </div>

            <Divider />

            <div className={[_s.d, _s.mt15, _s.pt10, _s.pb15, _s.w100PC].join(' ')}>
              <Heading size='h2'>Gab social icons</Heading>

              <div className={[_s.d, _s.mt15, _s.flexRow, _s.flexWrap, _s.w100PC].join(' ')}>
                <div className={[_s.d, _s.px15, _s.flexRow, _s.flexWrap, _s.aiCenter].join(' ')}>
                  <div className={[_s.d, _s.mr15, _s.h60PX, _s.w60PX, _s.aiCenter, _s.jcCenter, _s.overflowHidden, _s.bgBrand].join(' ')}>
                    <Icon id='gab-g' size='28px' className={_s.cWhite} />
                  </div>

                  <div className={[_s.d, _s.ml10, _s.mr15, _s.h60PX, _s.w60PX, _s.aiCenter, _s.jcCenter, _s.radiusSmall, _s.overflowHidden, _s.bgBrand].join(' ')}>
                    <Icon id='gab-g' size='28px' className={_s.cWhite} />
                  </div>

                  <div className={[_s.d, _s.ml10, _s.h60PX, _s.w60PX, _s.aiCenter, _s.jcCenter, _s.circle, _s.overflowHidden, _s.bgBrand].join(' ')}>
                    <Icon id='gab-g' size='28px' className={_s.cWhite} />
                  </div>
                </div>
              </div>
            </div>

            <Divider />
            <br />

            <Text tagName='p' className={[_s.mt15, _s.pt15, _s.pb15].join(' ')} size='medium'>
              By using the Gab resources on this site, you agree to follow our&nbsp;
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                to='/about/tos'
              >
                Terms of Service
              </Button>.
              &nbsp;and all other Gab rules and policies. If you have any questions, contact us at legal [at] gab [dot] com.
            </Text>
            
            <Text tagName='p' className={_s.mt15} size='medium'>
              For full terms and conditions of use of this site please see&nbsp;
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                to='/about/tos'
              >
                https://gab.com/about/tos
              </Button>.
            </Text>

            <br /><br />

          </div>
        </Block>
      </div>
    )
  }

}
