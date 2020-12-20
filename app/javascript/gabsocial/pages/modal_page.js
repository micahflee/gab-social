import React from 'react'
import PropTypes from 'prop-types'
import PageTitle from '../features/ui/util/page_title'
import Block from '../components/block'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  UserSuggestionsPanel,
} from '../features/ui/util/async_components'

class ModalPage extends React.PureComponent {

  render() {
    const {
      children,
      title,
      page,
    } = this.props

    return (
      <DefaultLayout
        noComposeButton
        title={title}
        page={page}
        showBackBtn
        layout={[
          UserSuggestionsPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={title} />
        
        <Block>
          <div className={[_s.d, _s.py15, _s.px15].join(' ')}>
            {children}
          </div>
        </Block>
      </DefaultLayout>
    )
  }

}

ModalPage.propTypes = {
  title: PropTypes.string,
  page: PropTypes.string,
  children: PropTypes.node,
}

export default ModalPage