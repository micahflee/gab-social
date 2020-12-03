import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Image from './image'


/**
 * Renders an avatar component
 * @param {list} [props.accounts] - the accounts for images
 * @param {number} [props.size=40] - the size of the avatar
 */
class AvatarGroup extends ImmutablePureComponent {

  render() {
    const { accounts, size } = this.props

    return (
      <div className={[_s.d].join(' ')}>
        {
          accounts.map((account) => {
            const isPro = account.get('is_pro')
            const alt = `${account.get('display_name')} ${isPro ? '(PRO)' : ''}`.trim()
            const className = [_s.d, _s.circle, _s.overflowHidden]
            if (isPro) {
              className.push(_s.boxShadowAvatarPro)
            }
        
            const options = {
              alt,
              className,
              src: account.get('avatar_static'),
              style: {
                width: `${size}px`,
                height: `${size}px`,
              },
            }
      
            return (
              <div className={[_s.d].join(' ')}>
                <Image {...options} />
              </div>
            )
          })
        }
      </div>
    )
  }

}

AvatarGroup.propTypes = {
  accounts: ImmutablePropTypes.list,
  size: PropTypes.number,
}

AvatarGroup.defaultProps = {
  size: 40,
}

export default AvatarGroup