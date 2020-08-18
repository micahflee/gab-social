import React from 'react'
import PropTypes from 'prop-types'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'
import PillItem from './pill_item'

/**
 * Renders pills components
 * @param {array} [props.pills] - tab bar data for creating `TabBarItem`
 */
class Pills extends React.PureComponent {

  render() {
    const { pills } = this.props

    return (
      <ResponsiveClassesComponent
        classNames={[_s.d, _s.flexWrap, _s.px5, _s.flexRow].join(' ')}
        classNamesXS={[_s.d, _s.overflowYHidden, _s.overflowXScroll, _s.noScrollbar, _s.pl10, _s.pr15, _s.flexRow].join(' ')}
      >
        {
          !!pills &&
          pills.map((tab, i) => (
            <PillItem
              key={`pill-item-${i}`}
              title={tab.title}
              onClick={tab.onClick}
              to={tab.to}
              isActive={tab.active}
            />
          ))
        }
      </ResponsiveClassesComponent>
    )
  }

}

Pills.propTypes = {
  pills: PropTypes.array,
}

export default Pills