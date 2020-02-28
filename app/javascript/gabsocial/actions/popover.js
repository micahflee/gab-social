export const POPOVER_OPEN = 'POPOVER_OPEN'
export const POPOVER_CLOSE = 'POPOVER_CLOSE'

export function openPopover(type, keyboard = false, placement = 'top') {
  return {
    keyboard,
    placement,
    type: POPOVER_OPEN,
    popoverType: type,
  }
}

export function closePopover(type) {
  return {
    type: POPOVER_CLOSE,
    popoverType: type,
  }
}
