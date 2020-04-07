import PopoverLayout from './popover_layout'
import List from '../list'

export default class SidebarMorePopover extends PureComponent {
  render() {
    return (
      <PopoverLayout className={_s.width240PX}>
        <List
          size='large'
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
        />
      </PopoverLayout>
    )
  }
}