import React from 'react'
import Block from '../../components/block'
import Button from '../../components/button'
import Divider from '../../components/divider'
import Heading from '../../components/heading'
import Text from '../../components/text'
import Table from '../../components/table'

export default class CaliforniaConsumerProtectionContact extends React.PureComponent {

  render() {

    return (
      <div className={[_s.d].join(' ')}>
        <Block>
          <div className={[_s.d, _s.px15, _s.py15].join(' ')}>
            <Heading>GAB AI INC</Heading>
            <br />
            <Heading>Contact form for Data Privacy</Heading>
            <br />

            <Text tagName='p' className={[_s.mt15].join(' ')} size='medium'>
              <Text weight='bold'>Email: </Text>
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='mailto:dataprivacy@gab.com'
              >
                dataprivacy@gab.com
              </Button>
            </Text>

          </div>
        </Block>
      </div>
    )
  }

}
