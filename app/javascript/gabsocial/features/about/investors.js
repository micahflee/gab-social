import React from 'react'
import Block from '../../components/block'
import Button from '../../components/button'
import Divider from '../../components/divider'
import Heading from '../../components/heading'
import Text from '../../components/text'

export default class Investors extends React.PureComponent {

  render() {

    return (
      <div className={[_s.d].join(' ')}>
        <Block>
          <div className={[_s.d, _s.minH50VH, _s.px15, _s.py15].join(' ')}>
            <Heading>Investors</Heading>
            <br />

            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='https://www.sec.gov/Archives/edgar/data/1709244/000110465920067852/annual_report.pdf'
              >
                2019 Annual Report
              </Button>
            </Text>

            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='https://www.sec.gov/Archives/edgar/data/1709244/000114420419021378/tv519744_annualreport.pdf'
              >
                2018 Annual Report
              </Button>
            </Text>

            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='https://www.sec.gov/Archives/edgar/data/1709244/000170924418000001/GAB_-_Annual_Report_-_2018.pdf'
              >
                2017 Annual Report
              </Button>
            </Text>
          </div>
        </Block>
      </div>
    )
  }

}
