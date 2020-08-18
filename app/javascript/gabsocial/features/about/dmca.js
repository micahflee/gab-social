import React from 'react'
import Block from '../../components/block'
import Button from '../../components/button'
import Divider from '../../components/divider'
import Heading from '../../components/heading'
import Text from '../../components/text'

export default class DMCA extends React.PureComponent {

  render() {

    return (
      <div className={[_s.d].join(' ')}>
        <Block>
          <div className={[_s.d, _s.px15, _s.py15].join(' ')}>
            <Heading>GAB AI INC</Heading>
            <br />
            <Heading>COPYRIGHT POLICY</Heading>
            <br />
            <Heading size='h2'>Reporting Claims of Copyright Infringement</Heading>
            <br />

            <Text tagName='p' className={_s.mt15} size='medium'>We take claims of copyright infringement seriously. We will respond to notices of alleged copyright infringement that comply with applicable law. If you believe any materials accessible on or from this site (the “Website”) infringe your copyright, you may request removal of those materials (or access to them) from the Website by submitting written notification to our copyright agent designated below. In accordance with the Online Copyright Infringement Liability Limitation Act of the Digital Millennium Copyright Act (17 U.S.C. § 512) (”DMCA”), the written notice (the “DMCA Notice”) must include substantially the following:</Text>

            <ul className={[_s.d, _s.px15, _s.mt15, _s.ml15].join(' ')}>
              <li>
                <Text tagName='p' size='medium'>Your physical or electronic signature.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Identification of the copyrighted work you believe to have been infringed or, if the claim involves multiple works on the Website, a representative list of such works.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Identification of the material you believe to be infringing in a sufficiently precise manner to allow us to locate that material.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Adequate information by which we can contact you (including your name, postal address, telephone number, and, if available, email address).</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>A statement that you have a good faith belief that use of the copyrighted material is not authorized by the copyright owner, its agent, or the law.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>A statement that the information in the written notice is accurate.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>A statement, under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</Text>
              </li>
            </ul>

            <Text tagName='p' className={_s.mt15} size='medium'>Please send copyright notices to:</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>
              Gab AI Inc.<br />
              700 N State Street<br />
              Clarks Summit, PA 18411
            </Text>
            <Text tagName='p' className={_s.mt15} size='medium'>Or via any contact form at the bottom of this page.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>If you fail to comply with all of the requirements of Section 512(c)(3) of the DMCA, your DMCA Notice may not be effective.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>Please be aware that if you knowingly materially misrepresent that material or activity on the Website is infringing your copyright, you may be held liable for damages (including costs and attorneys’ fees) under Section 512(f) of the DMCA.</Text>

            <br />
            <Heading size='h2'>Counter Notification Procedures</Heading>
            <Text tagName='p' className={_s.mt15} size='medium'>If you believe that material you posted on the Website was removed or access to it was disabled by mistake or misidentification, you may file a counter notification with us (a “Counter Notice”) by submitting written notification to our DMCA address (above) Pursuant to the DMCA, the Counter Notice must include substantially the following:</Text>

            <ul className={[_s.d, _s.px15, _s.mt15, _s.ml15].join(' ')}>
              <li>
                <Text tagName='p' size='medium'>Your physical or electronic signature.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>An identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access disabled.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Adequate information by which we can contact you (including your name, postal address, telephone number, and, if available, email address).</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>A statement under penalty of perjury by you that you have a good faith belief that the material identified above was removed or disabled as a result of a mistake or misidentification of the material to be removed or disabled.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>A statement that you will consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located (or if you reside outside the United States for any judicial district in which the Website may be found) and that you will accept service from the person (or an agent of that person) who provided the Website with the complaint at issue.</Text>
              </li>
            </ul>

            <Text tagName='p' className={_s.mt15} size='medium'>The DMCA allows us to restore the removed content if the party filing the original DMCA Notice does not file a court action against you within ten business days of receiving the copy of your Counter Notice.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>Please be aware that if you knowingly materially misrepresent that material or activity on the Website was removed or disabled by mistake or misidentification, you may be held liable for damages (including costs and attorneys’ fees) under Section 512(f) of the DMCA.</Text>

            <br />
            <Heading size='h2'>Repeat Infringers</Heading>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>It is our policy in appropriate circumstances to disable and/or terminate the accounts of users who are repeat infringers.</Text>

            <br />
            <Divider />

            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='mailto:support@gab.com'
              >
                support@gab.com
              </Button>
            </Text>
          </div>
        </Block>
      </div>
    )
  }

}
