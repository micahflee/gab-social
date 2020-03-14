import PopoverLayout from './popover_layout'
import List from '../list'

export default class SidebarMorePopover extends PureComponent {
  render() {
    return (
      <PopoverLayout>
        <List
          scrollKey='profile_options'
          items={[
            {
              title: 'Help',
              href: 'https://help.gab.com',
            },
            {
              title: 'Settings',
              href: '/settings',
            },
            {
              title: 'Log Out',
              href: '/auth/log_out',
            },
          ]}
          small
        />
      </PopoverLayout>
    )
  }
}