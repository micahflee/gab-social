export const POPOVER_OPEN = 'POPOVER_OPEN'
export const POPOVER_CLOSE = 'POPOVER_CLOSE'

export const openPopover = (type, props) => (dispatch, getState) => {
  const currentlyOpenPopover = getState().getIn(['popover', 'popoverType'])

  if (currentlyOpenPopover === type) {
    dispatch(closePopover(type))
  } else {
    dispatch(handleOpenPopover(type, props))
  }
}

export const closePopover = (type) => ({
  type: POPOVER_CLOSE,
  popoverType: type,
})

const handleOpenPopover = (type, props) => ({
  type: POPOVER_OPEN,
  popoverType: type,
  popoverProps: props,
})