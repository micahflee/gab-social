import { CX } from '../../constants'
import ResponsiveClassesComponent from '../../features/ui/util/responsive_classes_component'
import PlaceholderLayout from './placeholder_layout'

export default class StatusPlaceholder extends PureComponent {

  render() {
    const containerClasses = CX({
      default: 1,
      px15: 1,
      mt5: 1,
      mb15: 1,
      py10: 1,
      radiusSmall: 1,
      bgPrimary: 1,
      boxShadowBlock: 1,
    })

    const containerClassesXS = CX({
      default: 1,
      bgPrimary: 1,
      boxShadowBlock: 1,
      borderTop1PX: 1,
      px15: 1,
      py10: 1,
      mb15: 1,
      borderColorSecondary: 1,
    })

    return (
      <ResponsiveClassesComponent
        classNames={containerClasses}
        classNamesXS={containerClassesXS}
      >
        <PlaceholderLayout viewBox='0 0 476 136'>
          <rect x='48' y='8' width='88' height='6' rx='3' />
          <rect x='48' y='26' width='52' height='6' rx='3' />
          <rect x='0' y='56' width='410' height='6' rx='3' />
          <rect x='0' y='72' width='380' height='6' rx='3' />
          <rect x='0' y='88' width='178' height='6' rx='3' />
          <circle cx='20' cy='20' r='20' />
        </PlaceholderLayout>
      </ResponsiveClassesComponent>
    )

  }

}