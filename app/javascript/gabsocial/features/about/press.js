import React from 'react'
import Block from '../../components/block'
import Button from '../../components/button'
import Divider from '../../components/divider'
import Heading from '../../components/heading'
import Text from '../../components/text'

export default class Press extends React.PureComponent {

  render() {

    return (
      <div className={[_s.default, _s.minH50VH].join(' ')}>
        <Block>
          <div className={[_s.default, _s.px15, _s.py15, _s.mb10].join(' ')}>
            <Heading>Press Inquiries</Heading>
            
            <div className={[_s.d, _s.mt15, _s.pb15, _s.w100PC].join(' ')}>
              <Text tagName='p' className={_s.mt15} size='medium'>Gab is a social network that champions free speech, individual liberty and the free flow of information online. All are welcome.</Text>
              
              <Text tagName='p' className={_s.mt15} size='medium'>
                To contact Gab for press please email&nbsp;
                <Button
                  isText
                  underlineOnHover
                  color='brand'
                  backgroundColor='none'
                  className={_s.displayInline}
                  href='mailto:press@gab.com'
                >
                  press@gab.com
                </Button>.
              </Text>
            </div>

          </div>
        </Block>
      </div>
    )
  }

}
