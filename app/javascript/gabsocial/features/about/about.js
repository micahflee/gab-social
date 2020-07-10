import Block from '../../components/block'
import Button from '../../components/button'
import Divider from '../../components/divider'
import Heading from '../../components/heading'
import Text from '../../components/text'

export default class About extends PureComponent {

  render() {

    return (
      <div className={[_s.default].join(' ')}>
        <Block>
          <div className={[_s.default, _s.px15, _s.py15, _s.mb10].join(' ')}>
            <Heading>About Gab.com</Heading>
            
            <Text tagName='p' className={_s.mt15} size='medium'>This is the Gab Social instance of Gab.com. Political speech protected by the First Amendment is welcome on this instance.</Text>
            
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
          </div>

          <Divider />

          <div className={[_s.default, _s.px15, _s.py15].join(' ')} id='opensource'>
            <Heading>Open Source</Heading>

            <Text tagName='p' className={_s.mt15} size='medium'>At Gab, we believe that the future of online publishing is decentralized and open. We believe that users of social networks should be able to control their social media experience on their own terms, rather than the terms set down by Big Tech.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>Gab Social is a fresh take on one of the Internet's most popular applications: social networking. Originally forked from the Mastodon project, Gab's codebase is free and open-source, licensed under the GNU Affero General Public License version 3 (AGPL3).</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>As a result, you, the user, have a choice when using Gab Social: you can either have an account on Gab.com, or, if you don't like what we're doing on Gab.com or simply want to manage your own experience, you can spin up your own Gab Social server that you control, that allows you to communicate with millions of users on their own federated servers from around the world, including users on Gab.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>Gab.com strives to be the home of free speech online. We work on Gab Social 100% of the time as our full-time jobs. We positively encourage you to either join us on Gab.com or to spin up your own Gab Social server that you control to help take back control of the Web for the People.</Text>

            <Text tagName='p' className={_s.mt15} size='medium'>
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='https://code.gab.com/gab/social/gab-social'
              >
                https://code.gab.com/gab/social/gab-social
              </Button>
            </Text>
          </div>
        </Block>
      </div>
    )
  }

}
