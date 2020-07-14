import ReactSwipeableViews from 'react-swipeable-views'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { CX } from '../constants'
import { me } from '../initial_state'
import { saveShownOnboarding } from '../actions/onboarding'
import { fetchGroups } from '../actions/groups'
import {
  changeCompose,
  clearCompose,
} from '../actions/compose'
import { makeGetAccount } from '../selectors'
import Button from '../components/button'
import DisplayName from '../components/display_name'
import Divider from '../components/divider'
import FileInput from '../components/file_input'
import GroupListItem from '../components/group_list_item'
import Heading from '../components/heading'
import Icon from '../components/icon'
import Image from '../components/image'
import Input from '../components/input'
import Text from '../components/text'
import ComposeFormContainer from './compose/containers/compose_form_container'

class SlideWelcome extends PureComponent {

  render() {
    return (
      <div className={[_s.default, _s.width100PC, _s.height100PC].join(' ')}>
        <div className={[_s.default, _s.px15, _s.py15].join(' ')}>

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

        <Image
          className={[_s.mtAuto].join(' ')}
          src='https://gab.com/system/media_attachments/files/008/707/779/original/42de809171745057.png?1568251173'
        />
      </div>
    )
  }

}

class SlidePhotos extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const { account } = this.props

    return (
      <div className={[_s.default, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.px15, _s.py15, _s.alignItemsCenter].join(' ')}>

          <div className={[_s.default, _s.py10, _s.width330PX].join(' ')}>
            <Text size='large' align='center'>Set your cover photo, profile photo and enter your display name so people can find you.</Text>
          </div>

          <div className={[_s.default, _s.mt15, _s.width100PC, _s.alignItemsCenter].join(' ')}>
            <div className={[_s.default, _s.width330PX, _s.border1PX, _s.borderColorSecondary, _s.overflowHidden, _s.radiusSmall].join(' ')}>
              <Image
                width={330}
                height={194}
                src='http://localhost:3000/system/accounts/headers/000/000/001/original/0a49fe388d16f372.jpg?1562898139'
              />
              <div className={[_s.default, _s.mtNeg75PX, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
                <Image
                  width={142}
                  height={142}
                  className={[_s.circle, _s.border6PX, _s.borderColorWhite].join(' ')}
                  src='http://localhost:3000/system/accounts/avatars/000/000/001/original/260e8c96c97834da.jpeg?1562898139'
                />
              </div>
              <div className={[_s.default, _s.py5, _s.px15, _s.mt5, _s.mb15].join(' ')}>
                <Input
                  placeholder='John Doe'
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

}

class SlideGroups extends ImmutablePureComponent {

  static propTypes = {
    groupIds: ImmutablePropTypes.list,
  }

  render() {
    const { groupIds } = this.props

    return (
      <div className={[_s.default, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.py15, _s.alignItemsCenter].join(' ')}>
          <div className={[_s.default, _s.px15, _s.mb15].join(' ')}>
            <Text size='large'>Gab Groups are a great way to connect with people who share your interests. Please select a few groups to get started.</Text>
          </div>

          <div className={[_s.default, _s.width100PC].join(' ')}>
            {
              groupIds.map((groupId, i) => (
                <GroupListItem
                  isAddable
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

class SlideFirstPost extends PureComponent {

  static propTypes = {
    onNext: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className={[_s.default, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.py15, _s.px15].join(' ')}>
          <Text size='large' className={_s.pb10}>Now let's make your very first Gab post! Please introduce yourself to the Gab community. How did you hear about Gab? What are you interested in?</Text>
          <br />

          <Divider />

          <div className={[_s.default, _s.mt15, _s.boxShadowBlock, _s.radiusSmall].join(' ')}>
            <ComposeFormContainer hidePro autoFocus />
          </div>

        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
  groupIds: state.getIn(['group_lists', 'featured', 'items']),
  shownOnboarding: state.getIn(['settings', 'shownOnboarding'], false),
})

const mapDispatchToProps = (dispatch) => ({
  onClearCompose: () => dispatch(clearCompose()),
  onSaveShownOnboarding: () => dispatch(saveShownOnboarding()),
  onFetchFeaturedGroups: () => dispatch(fetchGroups('featured')),
  setPlaceholderCompose: () => dispatch(changeCompose('Hello everyone, I just joined Gab! I’m looking forward to speaking freely and meeting new friends.'))
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class Introduction extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    dispatch: PropTypes.func.isRequired,
    groupIds: ImmutablePropTypes.list,
    shownOnboarding: PropTypes.bool.isRequired,
    setPlaceholderCompose: PropTypes.func.isRequired,
    onClearCompose: PropTypes.func.isRequired,
    onSaveShownOnboarding: PropTypes.func.isRequired,
    onFetchFeaturedGroups: PropTypes.func.isRequired,
  }

  state = {
    currentIndex: 0,
  }

  componentDidMount() {
    if (!this.props.shownOnboarding) {
      window.addEventListener('keyup', this.handleKeyUp)
      this.props.onFetchFeaturedGroups()
      this.props.setPlaceholderCompose()
      this.props.onSaveShownOnboarding()
    }
  }

  componentWillUnmount() {
    window.addEventListener('keyup', this.handleKeyUp)
    this.props.onClearCompose()
  }

  handleDot = (e) => {
    const i = Number(e.currentTarget.getAttribute('data-index'))
    e.preventDefault()
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

    if (newIndex === 3) {
      this.props.onClearCompose()
    }
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

  render() {
    const { account, groupIds } = this.props
    const { currentIndex } = this.state

    const pages = [
      <SlideWelcome />,
      <SlidePhotos account={account} />,
      <SlideGroups groupIds={groupIds} />,
      <SlideFirstPost />,
    ]

    const titles = [
      `Welcome to Gab!`,
      'Complete your profile',
      'Find your people',
      'Start a conversation',
    ]
    const title = titles[currentIndex]

    const pagination = pages.map((page, i) => {
      const btnClasses = CX({
        default: 1,
        width10PX: 1,
        height10PX: 1,
        outlineNone: 1,
        circle: 1,
        cursorPointer: 1,
        bgBrandLightOpaque: i !== currentIndex,
        bgBrand: i === currentIndex,
      })

      return (
        <li className={[_s.default, _s.px5].join(' ')} key={`intro-slide-${i}`}>
          <button tabIndex='0' className={btnClasses} onClick={this.handleDot} data-index={i} />
        </li>
      )
    })
 
    return (
      <div className={[_s.default, _s.width100PC, _s.heightMax80VH].join(' ')}>
        <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX, _s.px15].join(' ')}>
          <Heading>
            {title}
          </Heading>
          <div className={[_s.mlAuto].join(' ')}>
            <Button
              to={currentIndex === 3 ? '/home' : undefined}
              onClick={this.handleNext}
              className={currentIndex !== 3 ? _s.px10 : undefined}
              icon={currentIndex !== 3 ? 'arrow-right' : undefined}
              iconSize={currentIndex !== 3 ? '18px' : undefined}
            > 
              {
                currentIndex === 3 &&
                <Text color='white' className={[_s.pr5]}>Complete</Text>
              }
            </Button>
          </div>
        </div>

        <ReactSwipeableViews
          index={currentIndex}
          onChangeIndex={this.handleSwipe}
          className={[_s.default, _s.flexNormal, _s.heightCalc80VH106PX].join(' ')}
          containerStyle={{
            width: '100%',
          }}
          slideStyle={{
            // height: '100%',
          }}
        >
          {
            pages.map((page, i) => (
              <div key={i} className={[_s.default, _s.heightCalc80VH106PX].join(' ')}>
                {page}
              </div>
            ))
          }
        </ReactSwipeableViews>

        <div className={[_s.default, _s.px15, _s.height53PX, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderTop1PX, _s.borderColorSecondary, _s.width100PC, _s.flexRow].join(' ')}>
          <div className={[_s.default, _s.width50PX, _s.mrAuto].join(' ')}>
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
          <ul className={[_s.default, _s.height100PC, _s.flexGrow1, _s.alignItemsCenter, _s.justifyContentCenter, _s.flexRow, _s.listStyleNone].join(' ')}>
            {pagination}
          </ul>
          <Button
            to={currentIndex === 3 ? '/home' : undefined}
            className={[_s.default, _s.width50PX, _s.mlAuto, _s.opacity05].join(' ')}
            onClick={this.handleNext}
            icon={currentIndex === 3 ? 'check' : 'arrow-right'}
            backgroundColor='none'
            color='secondary'
            iconSize='20px'
          />
        </div>
      </div>
    )
  }

}