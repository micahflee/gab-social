import React from 'react'
import { FormattedNumber } from 'react-intl'

export const shortNumberFormat = (number) => {
  if (isNaN(number)) {
    return <FormattedNumber value={0} />
  }
  
  if (number < 1000) {
    try {
      return (<FormattedNumber value={number} />).props.value
    } catch (error) {
      return <FormattedNumber value={0} />
    }
  }

  const isMillions = number > 999999
  const isThousands = number > 999 && !isMillions
  const divisor = isMillions ? 1000000 : isThousands ? 1000 : 1
  const suffix = isMillions ? 'm' : isThousands ? 'k' : ''
  return (
    <React.Fragment>
      <FormattedNumber value={number / divisor} maximumFractionDigits={1} />{suffix}
    </React.Fragment>
  )
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}