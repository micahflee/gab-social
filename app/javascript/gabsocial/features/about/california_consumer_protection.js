import React from 'react'
import Block from '../../components/block'
import Button from '../../components/button'
import Divider from '../../components/divider'
import Heading from '../../components/heading'
import Text from '../../components/text'
import Table from '../../components/table'

export default class CaliforniaConsumerProtection extends React.PureComponent {

  render() {

    return (
      <div className={[_s.d].join(' ')}>
        <Block>
          <div className={[_s.d, _s.px15, _s.py15].join(' ')}>
            <Heading>GAB AI INC</Heading>
            <br />
            <Heading>Privacy Policy for California Residents</Heading>
            <Heading size='h4'>Effective Date: 2 December 2020</Heading>
            <Heading size='h4'>Last Updated on: 2 December 2020</Heading>
            <br />

            <Text tagName='p' className={_s.mt15} size='medium'>This Privacy Policy for California Residents supplements the information contained in the Company's privacy policy and applies solely to all visitors, users, and others who reside in the State of California ("consumers" or "you"). We adopt this notice to comply with the California Consumer Privacy Act of 2018 (CCPA) and any terms defined in the CCPA have the same meaning when used in this Policy.</Text>
            
            <br />
            <Heading size='h2'>Information We Collect</Heading>
            <Text tagName='p' className={_s.mt15} size='medium'>We collect information that identifies, relates to, describes, references, is reasonably capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer, household, or device ("personal information"). Personal information does not include:</Text>

            <ul className={[_s.d, _s.px15, _s.mt15, _s.ml15].join(' ')}>
              <li>
                <Text tagName='p' size='medium'>Publicly available information from government records.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Deidentified or aggregated consumer information.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Information excluded from the CCPA's scope, like:</Text>

                <ul className={[_s.d, _s.px15, _s.mt15, _s.ml15].join(' ')}>
                  <li className={_s.mt10}>
                    <Text tagName='p' size='medium'>health or medical information covered by the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and the California Confidentiality of Medical Information Act (CMIA), clinical trial data, or other qualifying research data;</Text>
                  </li>
                  <li className={_s.mt10}>
                    <Text tagName='p' size='medium'>personal information covered by certain sector-specific privacy laws, including the Fair Credit Reporting Act (FCRA), the Gramm-Leach-Bliley Act (GLBA) or California Financial Information Privacy Act (FIPA), and the Driver's Privacy Protection Act of 1994.</Text>
                  </li>
                </ul>
              </li>
            </ul>

            <Text tagName='p' className={_s.mt15} size='medium'>In particular, we have collected the following categories of personal information from consumers within the last twelve (12) months: </Text>

            <br />
            <Table
              id='table-1'
              columns={['Category', 'Examples', 'Collected']}
              rows={[
                ['A. Identifiers.', "A real name, alias, postal address, unique personal identifier, online identifier, Internet Protocol address, email address, account name, Social Security number, driver's license number, passport number, or other similar identifiers.", "Yes."],
                ["B. Personal information categories listed in the California Customer Records statute (Cal. Civ. Code § 1798.80(e)).", "name, signature, Social Security number, physical characteristics or description, address, telephone number, passport number, driver's license or state identification card number, insurance policy number, education, employment, employment history, bank account number, credit card number, debit card number, or any other financial information, medical information, or health insurance information. Some personal information included in this category may overlap with other categories.", "Yes"],
                ["C. Protected classification characteristics under California or federal law.", "Age (40 years or older), race, color, ancestry, national origin, citizenship, religion or creed, marital status, medical condition, physical or mental disability, sex (including gender, gender identity, gender expression, pregnancy or childbirth and related medical conditions), sexual orientation, veteran or military status, genetic information (including familial genetic information).", "Yes if you choose to provide it as part of your user profile or user generated content."],
                ["D. Commercial information.", "Records of personal property, products or services purchased, obtained, or considered, or other purchasing or consuming histories or tendencies.", "Yes."],
                ["E. Biometric information.", "Genetic, physiological, behavioral, and biological characteristics, or activity patterns used to extract a template or other identifier or identifying information, such as, fingerprints, faceprints, and voiceprints, iris or retina scans, keystroke, gait, or other physical patterns, and sleep, health, or exercise data.", "Yes if you choose to provide it as part of your user profile or user generated content."],
                ["F. Internet or other similar network activity.", "Browsing history, search history, information on a consumer's interaction with a website, application, or advertisement.", "Yes."],
                ["G. Geolocation data.", "Physical location or movements or information which might be able to ascertain physical location e.g. IP address.", "Yes."],
                ["H. Sensory data.", "Audio, electronic, visual, thermal, olfactory, or similar information.", "Yes, if you choose to provide it as part of your user profile or user generated content."],
                ["I. Professional or employment-related information.", "Current or past job history or performance evaluations.", "Yes, if you choose to provide it as part of your user profile or user generated content."],
                ["J. Non-public education information (per the Family Educational Rights and Privacy Act (20 U.S.C. Section 1232g, 34 C.F.R. Part 99)).", "Education records directly related to a student maintained by an educational institution or party acting on its behalf, such as grades, transcripts, class lists, student schedules, student identification codes, student financial information, or student disciplinary records.", "Yes, if you choose to provide it as part of their user profile or user generated content."],
                ["K. Inferences drawn from other personal information.", "Profile reflecting a person's preferences, characteristics, psychological trends, predispositions, behavior, attitudes, intelligence, abilities, and aptitudes.", "No."]
              ]}
            />

            <Text tagName='p' className={_s.mt15} size='medium'>We obtain the categories of personal information listed above from the following categories of sources:</Text>
            <ul className={[_s.d, _s.px15, _s.mt15, _s.ml15].join(' ')}>
              <li>
                <Text tagName='p' size='medium'>Directly from you. For example, from forms you complete, video, photos, and text information which you post, products and services you purchase, and communications you make with us.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Indirectly from you. For example, from observing your actions on our Website.</Text>
              </li>
            </ul>
            
            <br />
            <Heading size='h2'>Use of Personal Information</Heading>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>We do not sell user information. We may use or disclose the personal information we collect for one or more of the following purposes:</Text>
            <ul className={[_s.d, _s.px15, _s.mt15, _s.ml15].join(' ')}>
              <li>
                <Text tagName='p' size='medium'>To fulfill or meet the reason you provided the information. For example, if you share your name and contact information to request a price quote or ask a question about our products or services, we will use that personal information to respond to your inquiry. If you provide your personal information to purchase a product or service, we will use that information to process your payment and facilitate delivery. We may also save your information to facilitate new product orders or process returns.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>To provide, support, personalize, and develop our Website, products, and services.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>To create, maintain, customize, and secure your account with us.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>To process your requests, purchases, transactions, and payments and prevent transactional fraud.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>To provide you with support and to respond to your inquiries, including to investigate and address your concerns and monitor and improve our responses.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>To personalize your Website experience and to deliver content and product and service offerings relevant to your interests, including targeted offers and ads through our Website, third-party sites, and via email or text message (with your consent, where required by law).</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>To help maintain the safety, security, and integrity of our Website, products and services, databases and other technology assets, and business.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>For testing, research, analysis, and product development, including to develop and improve our Website, products, and services.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>To respond to law enforcement requests and as required by applicable law, court order, or governmental regulations.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>As described to you when collecting your personal information or as otherwise set forth in the CCPA.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>To evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which personal information held by us about our Website and our users is among the assets transferred.</Text>
              </li>
            </ul>

            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>We will not collect additional categories of personal information or use the personal information we collected for materially different, unrelated, or incompatible purposes without providing you notice.</Text>

            <br />
            <Heading size='h2'>Sharing Personal Information</Heading>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>We may share your personal information by disclosing it to a third party for a business purpose. We only make these business purpose disclosures under written contracts that describe the purposes, require the recipient to keep the personal information confidential, and prohibit using the disclosed information for any purpose except performing the contract. In the preceding twelve (12) months, Company has disclosed personal information for a business purpose to the categories of third parties indicated in the chart below.</Text>
            <Text tagName='p' className={_s.mt15}  size='medium'>We do not sell your personal information. For more on your personal information sale rights, see Personal Information Sales Opt-Out and Opt-In Rights.</Text>

            <Table
              id='table-2'
              columns={['Personal Information Category', 'Business Purpose Disclosures']}
              rows={[
                ['A. Identifiers.', "Affiliates, vendors, consultants and other service providers. Professional advisors and consultants. Law enforcement."],
                ["B: California Customer Records personal information categories.", "Affiliates, vendors, consultants and other service providers. Professional advisors and consultants. Law enforcement."],
                ["C: Protected classification characteristics under California or federal law.", "Affiliates, vendors, consultants and other service providers. Professional advisors and consultants. Law enforcement."],
                ["D: Commercial information.", "Affiliates, vendors, consultants and other service providers. Professional advisors and consultants. Law enforcement."],
                ["E: Biometric information", "Affiliates, vendors, consultants and other service providers. Professional advisors and consultants. Law enforcement."],
                ["F: Internet or other similar network activity.", "Affiliates, vendors, consultants and other service providers. Professional advisors and consultants. Law enforcement."],
                ["G: Geolocation data (such as IP address)", "Affiliates, vendors, consultants and other service providers. Professional advisors and consultants. Law enforcement."],
                ["H: Sensory data.", "Affiliates, vendors, consultants and other service providers. Professional advisors and consultants. Law enforcement."],
                ["I: Professional or employment-related information.", "Affiliates, vendors, consultants and other service providers. Professional advisors and consultants. Law enforcement."],
                ["J: Non-public education information.", "Affiliates, vendors, consultants and other service providers. Professional advisors and consultants. Law enforcement."],
                ["K: Inferences drawn from other personal information.", "Not applicable"],
              ]}
            />

            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium' weight='bold'>Reselling Personal Information</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>The CCPA prohibits a third party from reselling personal information unless you have received explicit notice and an opportunity to opt-out of further sales. We do not sell your personal information and to our knowledge none of our service providers sell your personal information. If at any future time we do sell users’ personal information you will be afforded the opportunity to opt-out and we will provide a clear and conspicuous link on Gab.com that will enable you to opt-out.</Text>

            <br />
            <Heading size='h2'>Your Rights and Choices </Heading>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>The CCPA provides consumers (California residents) with specific rights regarding their personal information. This section describes your CCPA rights and explains how to exercise those rights.</Text>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium' weight='bold'>Right to Know and Data Portability</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>You have the right to request that we disclose certain information to you about our collection and use of your personal information over the past 12 months (the "right to know"). Once we receive your request and confirm your identity (see Exercising Your Rights to Know or Delete), we will disclose to you:</Text>

            <ul className={[_s.d, _s.px15, _s.mt15, _s.ml15].join(' ')}>
              <li>
                <Text tagName='p' size='medium'>The categories of personal information we collected about you.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>The categories of sources for the personal information we collected about you.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Our business or commercial purpose for collecting or selling that personal information.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>The categories of third parties with whom we share that personal information.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>If we sold or disclosed your personal information for a business purpose, two separate lists disclosing:</Text>
                <ul className={[_s.d, _s.px15, _s.mt15, _s.ml15].join(' ')}>
                  <li className={_s.mt10}>
                    <Text tagName='p' size='medium'>sales, identifying the personal information categories that each category of recipient purchased; and</Text>
                  </li>
                  <li className={_s.mt10}>
                    <Text tagName='p' size='medium'>disclosures for a business purpose, identifying the personal information categories that each category of recipient obtained.</Text>
                  </li>
                </ul>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>The specific pieces of personal information we collected about you (also called a data portability request).</Text>
              </li>
            </ul>

            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium' weight='bold'>Right to Delete</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>You have the right to request that we delete any of your personal information that we collected from you and retained, subject to certain exceptions (the "right to delete"). Once we receive your request and confirm your identity (see Exercising Your Rights to Know or Delete), we will review your request to see if an exception allowing us to retain the information applies. We may deny your deletion request if retaining the information is necessary for us or our service provider(s) to:</Text>
            <ol className={[_s.d, _s.px15, _s.mt15, _s.ml15].join(' ')}>
              <li>
                <Text tagName='p' size='medium'>Complete the transaction for which we collected the personal information, provide a good or service that you requested, take actions reasonably anticipated within the context of our ongoing business relationship with you, fulfill the terms of a written warranty or product recall conducted in accordance with federal law, or otherwise perform our contract with you.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Detect security incidents, protect against malicious, deceptive, fraudulent, or illegal activity, or prosecute those responsible for such activities.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Debug products to identify and repair errors that impair existing intended functionality.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Exercise free speech, ensure the right of another consumer to exercise their free speech rights, or exercise another right provided for by law.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Comply with the California Electronic Communications Privacy Act (Cal. Penal Code § 1546 et. seq.).</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Engage in public or peer-reviewed scientific, historical, or statistical research in the public interest that adheres to all other applicable ethics and privacy laws, when the information's deletion may likely render impossible or seriously impair the research's achievement, if you previously provided informed consent.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Enable solely internal uses that are reasonably aligned with consumer expectations based on your relationship with us.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Comply with a legal obligation.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Make other internal and lawful uses of that information that are compatible with the context in which you provided it.</Text>
              </li>
            </ol>

            <Text tagName='p' className={_s.mt15} size='medium'>We will delete or deidentify personal information not subject to one of these exceptions from our records and will direct our service providers to take similar action.</Text>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium' weight='bold'>Exercising Your Rights to Know or Delete</Text>
            
            <Text tagName='p' className={_s.mt15} size='medium'>To exercise your rights to know or delete described above, please submit a request by (preferred) e-mailing us at&nbsp;
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
              &nbsp;; sending a request to us via our CCPA portal at&nbsp;
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='/about/ccpa/contact'
              >
                gab.com/about/ccpa/contact
              </Button>
              , or or mailing us at
            </Text>
            <Text tagName='p' className={_s.mt15} size='medium'>
              Gab AI Inc.<br />
              700 N State Street<br />
              Clarks Summit, PA 18411<br />
              United States of America
            </Text>
            
            <Text tagName='p' className={_s.mt15}size='medium'>Only you, or someone legally authorized to act on your behalf, may make a request to know or delete related to your personal information.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>You may also make a request to know or delete on behalf of your child, in which case we will require proof of identity and proof of account ownership.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>You may only submit a request to know twice within a 12-month period. Your request to know or delete must:</Text>
            <ul className={[_s.d, _s.px15, _s.mt15, _s.ml15].join(' ')}>
              <li>
                <Text tagName='p' size='medium'>Provide sufficient information that allows us to reasonably verify you are the person about whom we collected personal information or an authorized representative.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Describe your request with sufficient detail that allows us to properly understand, evaluate, and respond to it.</Text>
              </li>
            </ul>

            <Text tagName='p' className={_s.mt15} size='medium'>We cannot respond to your request or provide you with personal information if we cannot verify your identity or authority to make the request and confirm the personal information relates to you.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>You do not need to create an account with us to submit a request to know or delete. However, we do consider requests made through your password protected account sufficiently verified when the request relates to personal information associated with that specific account.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>We will only use personal information provided in the request to verify the requestor's identity or authority to make it.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>For instructions on exercising your sale opt-out or opt-in rights, see Personal Information Sales Opt-Out and Opt-In Rights.</Text>

            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium' weight='bold'>Response Timing and Format</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>We will confirm receipt of your request within ten (10) business days. If you do not receive confirmation within the 10-day timeframe, please contact us at&nbsp;
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
              .
            </Text>
            <Text tagName='p' className={_s.mt15} size='medium'>We endeavor to substantively respond to a verifiable consumer request within forty-five (45) days of its receipt. If we require more time (up to another 45 days), we will inform you of the reason and extension period in writing.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>If you have an account with us, we will deliver our written response to that account[ via the contact address associated with that account]. If you do not have an account with us, we will deliver our written response by mail or electronically, at your option.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>Any disclosures we provide will only cover the 12-month period preceding our receipt of your request. The response we provide will also explain the reasons we cannot comply with a request, if applicable. For data portability requests, we will select a format to provide your personal information that is readily useable and should allow you to transmit the information from one entity to another entity without hindrance.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>We do not charge a fee to process or respond to your verifiable consumer request unless it is excessive, repetitive, or manifestly unfounded. If we determine that the request warrants a fee, we will tell you why we made that decision and provide you with a cost estimate before completing your request.</Text>

            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium' weight='bold'>Personal Information Sales Opt-Out and Opt-In Rights</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>If you are age 16 or older, you have the right to direct us to not sell your personal information at any time (the "right to opt-out"). We do not sell the personal information of any user. If in the future we decide to sell personal information, we will afford you with a right to opt-out and will provide an opt-out link in this CCPA Privacy Policy.</Text>

            <br />
            <Heading size='h2'>Non-Discrimination</Heading>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>You have a right not to receive discriminatory treatment for exercising your CCPA rights and we will not discriminate against you for exercising any of your CCPA rights. Unless permitted by the CCPA, we will not:</Text>
            <ul className={[_s.d, _s.px15, _s.mt15, _s.ml15].join(' ')}>
              <li>
                <Text tagName='p' size='medium'>Deny you goods or services.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Charge you different prices or rates for goods or services, including through granting discounts or other benefits, or imposing penalties.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Provide you a different level or quality of goods or services.</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>Suggest that you may receive a different price or rate for goods or services or a different level or quality of goods or services.</Text>
              </li>
            </ul>

            <br />
            <Heading size='h2'>CCPA Rights Request Met</Heading>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>Metrics regarding the consumer rights requests we received from California residents from January 1, 2019 to December 31, 2019 appear in the following chart:</Text>
            <Table
              id='table-3'
              columns={['Request Type', 'Received', 'Granted (in whole or in part)', 'Denied', 'Mean Days to Respond']}
              rows={[
                ["Requests to Know", "0", "0", "0", "N/A"],
                ["Requests to Delete", "0", "0", "0", "N/A"],
                ["Requests to Opt-Out of Personal Information Sales", "N/A", "N/A", "N/A", "N/A"],
              ]}
            />

            <br />
            <Heading size='h2'>Other California Privacy Rights</Heading>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>California's "Shine the Light" law (Civil Code Section § 1798.83) permits users of our Website that are California residents to request certain information regarding our disclosure of personal information to third parties for their direct marketing purposes. To make such a request, please write to us at Gab AI Inc., 700 N State Street, Clarks Summit, PA, 18411.</Text>
            
            <br />
            <Heading size='h2'>Changes to Our Privacy Policy</Heading>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>We reserve the right to amend this privacy policy at our discretion and at any time. When we make changes to this privacy policy, we will post the updated notice on the Website and update the notice's effective date. Your continued use of our Website following the posting of changes constitutes your acceptance of such changes.</Text>
            
            <br />
            <Heading size='h2'>Contact Information</Heading>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>If you have any questions or comments about this notice, the ways in which Gab collects and uses your information described here and in the Privacy Policy, your choices and rights regarding such use, or wish to exercise your rights under California law, please do not hesitate to contact us at:</Text>

            <Text tagName='p' className={[_s.mt15].join(' ')} size='medium'>
              <Text weight='bold'>Contact form: </Text>
              If you have any questions or comments about this notice, the ways in which Gab collects and uses your information described here and in the Privacy Policy, your choices and rights regarding such use, or wish to exercise your rights under California law, please do not hesitate to contact us at:
            </Text>
            
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

            <Text tagName='p' className={[_s.mt15].join(' ')} size='medium'>
              <Text weight='bold'>Postal Address: </Text>
              Gab AI Inc.<br />
              700 N State Street<br />
              Clarks Summit, PA 18411<br />
              Attn: Data Privacy Department
            </Text>

            <Text tagName='p' className={[_s.mt15].join(' ')} size='medium'>If you need to access this Policy in an alternative format due to having a disability, please contact&nbsp;
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
