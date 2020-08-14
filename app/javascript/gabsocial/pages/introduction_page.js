import PageTitle from '../features/ui/util/page_title'
import IntroductionLayout from '../layouts/introduction_layout'

export default class IntroductionPage extends PureComponent {

  render() {
    return (
      <IntroductionLayout>
        <PageTitle path='Welcome to Gab' />
        {this.props.children}
      </IntroductionLayout>
    )
  }

}