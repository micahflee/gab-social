import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactSwipeableViews from 'react-swipeable-views'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
  GAB_COM_INTRODUCE_YOURSELF_GROUP_ID,
} from '../constants'
import { me } from '../initial_state'
import { saveShownOnboarding } from '../actions/settings'
import { fetchGroupsByTab } from '../actions/groups'
import { saveUserProfileInformation } from '../actions/user'
import { makeGetAccount } from '../selectors'
import Button from '../components/button'
import Divider from '../components/divider'
import FileInput from '../components/file_input'
import GroupListItem from '../components/group_list_item'
import Heading from '../components/heading'
import Icon from '../components/icon'
import Image from '../components/image'
import Input from '../components/input'
import Text from '../components/text'
import Pagination from '../components/pagination'
import ComposeFormContainer from './compose/containers/compose_form_container'
import Responsive from './ui/util/responsive_component'

const SlideWelcome = () => (
  <div className={[_s.d, _s.w100PC, _s.h100PC].join(' ')}>
    <Image src='/headers/onboarding.png' alt='Welcome to Gab' />

    <div className={[_s.d, _s.px15, _s.py15].join(' ')}>

      <Text size='large'>Gab is the home of free speech online and a place where users shape their own experience. </Text>
      <br />
      <Text size='large'>You will discover many different ideas, people, and topics on Gab.</Text>
      <br />
      <Text size='large'>Follow the people you find interesting and block or mute people you don't want to associate with.</Text>
      <br />
      <Text size='large'>Speak freely, associate freely!</Text>
      <br />
      <Text size='large'>Let's get started!</Text>

    </div>

  </div>
)

class SlidePhotos extends ImmutablePureComponent {

  state = {
    displayNameValue: this.props.account.get('display_name'),
  }

  handleCoverPhotoChange = (e) => {
    try {
      this.props.onSave({ header: e.target.files[0] })
    } catch (error) {
      // 
    }
  }

  handleProfilePhotoChange = (e) => {
    try {
      this.props.onSave({ avatar: e.target.files[0] })
    } catch (error) {
      // 
    }
  }

  handleDisplayNameChange = (value) => {
    this.setState({ displayNameValue: value })
  }

  handleDisplayNameBlur = () => {
    this.props.onSave({
      displayName: this.state.displayNameValue,
    })
  }

  render() {
    const { displayNameValue } = this.state

    return (
      <div className={[_s.d, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.px15, _s.py15, _s.aiCenter].join(' ')}>

          <div className={[_s.d, _s.py10, _s.maxW640PX].join(' ')}>
            <Text size='large' align='center'>Set your cover photo, profile photo and enter your display name so people can find you.</Text>
          </div>

          <div className={[_s.d, _s.mt15, _s.w100PC, _s.aiCenter].join(' ')}>
            <div className={[_s.d, _s.border1PX, _s.borderColorSecondary, _s.overflowHidden, _s.radiusSmall, _s.bgPrimary].join(' ')}>
              <FileInput
                width='300px'
                height='140px'
                id='cover-photo'
                onChange={this.handleCoverPhotoChange}
              />
              <div className={[_s.d, _s.mtNeg32PX, _s.aiCenter, _s.jcCenter].join(' ')}>
                <FileInput
                  width='124px'
                  height='124px'
                  id='profile-photo'
                  className={[_s.circle, _s.border6PX, _s.borderColorWhite, _s.bgPrimary].join(' ')}
                  onChange={this.handleProfilePhotoChange}
                />
              </div>
              <div className={[_s.d, _s.py5, _s.px15, _s.mt5, _s.mb15].join(' ')}>
                <Input
                  id='display-name'
                  title='Display name'
                  placeholder='Add your name...'
                  maxLength={30}
                  value={displayNameValue}
                  onChange={this.handleDisplayNameChange}
                  onBlur={this.handleDisplayNameBlur}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

}

SlidePhotos.propTypes = {
  account: ImmutablePropTypes.map.isRequired,
}

class SlideGroups extends ImmutablePureComponent {

  render() {
    const { groupIds } = this.props

    return (
      <div className={[_s.d, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.py15, _s.aiCenter].join(' ')}>
          <div className={[_s.d, _s.px15, _s.mb15].join(' ')}>
            <Text size='large'>Gab Groups are a great way to connect with people who share your interests. Please select a few groups to get started.</Text>
          </div>

          <div className={[_s.d, _s.w100PC].join(' ')}>
            {
              groupIds.map((groupId, i) => (
                <GroupListItem
                  isAddable
                  isStatic
                  key={`group-collection-item-${i}`}
                  id={groupId}
                  isLast={groupIds.count() - 1 === i}
                />
              ))
            }
          </div>
        </div>
      </div>
    )
  }

}

SlideGroups.propTypes = {
  groupIds: ImmutablePropTypes.list,
}

class SlideFirstPost extends React.PureComponent {

  render() {
    const { submitted } = this.props

    return (
      <div className={[_s.d, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.py15, _s.px15].join(' ')}>
          {
            !submitted &&
            <React.Fragment>
              <Text size='large' className={_s.pb10}>Now let's make your very first Gab post! Please introduce yourself to the Gab community. How did you hear about Gab? What are you interested in?</Text>
              <br />

              <div className={[_s.d, _s.boxShadowBlock, _s.overflowHidden, _s.radiusSmall].join(' ')}>
                <ComposeFormContainer
                  formLocation='introduction'
                  groupId={GAB_COM_INTRODUCE_YOURSELF_GROUP_ID}
                  hidePro
                  autoJoinGroup
                />
              </div>
            </React.Fragment>
          }
          {
            submitted &&
            <React.Fragment>
              <Text size='large' align='center'>Your gab was posted!</Text>
              <br />
              <Text size='large' align='center'>Welcome to our community, remember to speak freely.</Text>
              <br />
              <Button
                href='/home'
                onClick={this.props.onNext}
              >
                Finish
              </Button>
            </React.Fragment>
          }

        </div>
      </div>
    )
  }

}

SlideFirstPost.propTypes = {
  submitted: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
}

class Introduction extends ImmutablePureComponent {

  state = {
    currentIndex: 0,
    submittedFirstPost: false,
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp)
    this.props.onFetchFeaturedGroups()
    this.props.onSaveShownOnboarding()
  }

  componentDidUpdate(prevProps) {
    if (!this.state.submittedFirstPost && !prevProps.isSubmitting && this.props.isSubmitting) {
      this.setState({ submittedFirstPost: true })
    }
  }

  componentWillUnmount() {
    window.addEventListener('keyup', this.handleKeyUp)
  }

  handleDot = (i) => {
    this.setState({ currentIndex: i })
  }

  handlePrev = () => {
    this.setState(({ currentIndex }) => ({
      currentIndex: Math.max(0, currentIndex - 1),
    }))
  }

  handleNext = () => {
    const newIndex = Math.min(this.state.currentIndex + 1, 3)
    this.setState({
      currentIndex: newIndex,
    })
  }

  handleSwipe = (index) => {
    this.setState({ currentIndex: index })
  }

  handleKeyUp = ({ key }) => {
    switch (key) {
      case 'ArrowLeft':
        this.handlePrev()
        break
      case 'ArrowRight':
        this.handleNext()
        break
    }
  }

  handleOnSaveUserProfileInformation = (data) => {
    this.props.onSaveUserProfileInformation(data)
  }

  render() {
    const { account, groupIds } = this.props
    const { currentIndex, submittedFirstPost } = this.state

    const pages = [
      <SlideWelcome />,
      <SlidePhotos
        account={account}
        onSave={this.handleOnSaveUserProfileInformation}
      />,
      <SlideGroups groupIds={groupIds} />,
      <SlideFirstPost
        submitted={submittedFirstPost}
        onNext={this.handleNext}
      />,
    ]

    const titles = [
      `Welcome to Gab!`,
      'Complete your profile',
      'Find your people',
      'Start a conversation',
    ]
    const title = titles[currentIndex]

    const nextTitle = currentIndex === 3 ? 'Finish' : 'Next'

    return (
      <div className={[_s.d, _s.w100PC, _s.maxH80VH].join(' ')}>
        <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.jcCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.h53PX, _s.px15].join(' ')}>
          <Responsive min={BREAKPOINT_EXTRA_SMALL}>
            <Heading>
              {title}
            </Heading>
          </Responsive>
          <Responsive max={BREAKPOINT_EXTRA_SMALL}>
            <Heading size='h2'>
              {title}
            </Heading>
          </Responsive>
          <div className={[_s.mlAuto].join(' ')}>
            <Button
              href={currentIndex === 3 ? '/home' : undefined}
              onClick={this.handleNext}
              className={[_s.px10, _s.aiCenter, _s.flexRow].join(' ')}
              icon={currentIndex !== 3 ? 'arrow-right' : undefined}
              iconSize={currentIndex !== 3 ? '18px' : undefined}
            >
              {
                currentIndex === 3 &&
                <React.Fragment>
                  <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                    <Text color='white' className={_s.px5}>{nextTitle}</Text>
                  </Responsive>
                  <Responsive max={BREAKPOINT_EXTRA_SMALL}>
                    <Text color='white' className={[_s.px5, _s.mr5].join(' ')}>Done</Text>
                    <Icon id='check' size='14px' className={_s.cWhite} />
                  </Responsive>
                </React.Fragment>
              }
            </Button>
          </div>
        </div>

        <ReactSwipeableViews
          index={currentIndex}
          onChangeIndex={this.handleSwipe}
          className={[_s.d, _s.flexNormal, _s.calcH80VH106PX].join(' ')}
          containerStyle={{
            width: '100%',
          }}
          slideStyle={{
            // height: '100%',
          }}
        >
          {
            pages.map((page, i) => (
              <div key={i} className={[_s.d, _s.calcH80VH106PX].join(' ')}>
                {page}
              </div>
            ))
          }
        </ReactSwipeableViews>

        <div className={[_s.d, _s.px15, _s.h53PX, _s.aiCenter, _s.jcCenter, _s.borderTop1PX, _s.borderColorSecondary, _s.w100PC, _s.flexRow].join(' ')}>
          <div className={[_s.d, _s.w50PX, _s.mrAuto].join(' ')}>
            {
              currentIndex !== 0 &&
              <Button
                className={_s.opacity05}
                onClick={this.handlePrev}
                icon='arrow-left'
                backgroundColor='none'
                color='secondary'
                iconSize='20px'
              />
            }
          </div>
            
          <div className={[_s.d, _s.h100PC, _s.flexGrow1, _s.aiCenter, _s.jcCenter].join(' ')}>
            <Pagination
              count={pages.length}
              activeIndex={currentIndex}
              onClick={this.handleDot}
              color='brand'
            />
          </div>
          
          <Button
            isText
            href={currentIndex === 3 ? '/home' : undefined}
            className={[_s.d, _s.w50PX, _s.h100PC, _s.jcCenter, _s.pr0, _s.pl0, _s.mlAuto, _s.opacity05].join(' ')}
            onClick={this.handleNext}
            backgroundColor='none'
            color='secondary'
          >
            <Text color='inherit' align='right'>{nextTitle}</Text>
          </Button>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
  groupIds: state.getIn(['group_lists', 'featured', 'items']),
  shownOnboarding: state.getIn(['settings', 'shownOnboarding'], false),
  isSubmitting: state.getIn(['compose', 'is_submitting']),
})

const mapDispatchToProps = (dispatch) => ({
  onSaveShownOnboarding: () => dispatch(saveShownOnboarding()),
  onFetchFeaturedGroups: () => dispatch(fetchGroupsByTab('featured')),
  onSaveUserProfileInformation(data) {
    dispatch(saveUserProfileInformation(data))
  },
})

Introduction.propTypes = {
  account: ImmutablePropTypes.map.isRequired,
  groupIds: ImmutablePropTypes.list,
  isSubmitting: PropTypes.bool.isRequired,
  shownOnboarding: PropTypes.bool.isRequired,
  onSaveShownOnboarding: PropTypes.func.isRequired,
  onFetchFeaturedGroups: PropTypes.func.isRequired,
  onSaveUserProfileInformation: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Introduction)