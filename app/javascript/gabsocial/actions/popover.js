export const POPOVER_OPEN = 'POPOVER_OPEN'
export const POPOVER_CLOSE = 'POPOVER_CLOSE'

export function openPopover(type, props) {
  return {
    type: POPOVER_OPEN,
    popoverType: type,
    popoverProps: props,
  }
}

export function closePopover(type) {
  return {
    type: POPOVER_CLOSE,
    popoverType: type,
  }
}
