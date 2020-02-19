'use strict'

import detectPassiveEvents from 'detect-passive-events'

const BREAKPOINT_EXTRA_LARGE = 1480
const BREAKPOINT_LARGE = 1280
const BREAKPOINT_MEDIUM = 1160
const BREAKPOINT_SMALL = 1080
const BREAKPOINT_EXTRA_SMALL = 992

export function breakpointExtraLarge(width) {
  return width > BREAKPOINT_EXTRA_LARGE
}

export function breakpointLarge(width) {
  return width > BREAKPOINT_MEDIUM && width < BREAKPOINT_LARGE
}

export function breakpointMedium(width) {
  return width > BREAKPOINT_SMALL && width < BREAKPOINT_MEDIUM
}

export function breakpointSmall(width) {
  return width > BREAKPOINT_EXTRA_SMALL && width < BREAKPOINT_SMALL
}

export function breakpointExtraSmall(width) {
  return width < BREAKPOINT_EXTRA_SMALL
}

//

const LAYOUT_BREAKPOINT = 630

export function isMobile(width) {
  return width <= LAYOUT_BREAKPOINT
}

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

let userTouching = false
let listenerOptions = detectPassiveEvents.hasSupport ? { passive: true } : false

function touchListener() {
  userTouching = true
  window.removeEventListener('touchstart', touchListener, listenerOptions)
}

window.addEventListener('touchstart', touchListener, listenerOptions)

export function isUserTouching() {
  return userTouching
}

export function isIOS() {
  return iOS
}
