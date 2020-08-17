import React from 'react'
import { FormattedNumber } from 'react-intl'

export const shortNumberFormat = (number) => {
  if (number < 1000) {
    try {
      return (<FormattedNumber value={number} />).props.value
    } catch (error) {
      return <FormattedNumber value={number} />
    }
  }

  return (
    <React.Fragment>
      <FormattedNumber value={number / 1000} maximumFractionDigits={1} />k
    </React.Fragment>
  )
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}