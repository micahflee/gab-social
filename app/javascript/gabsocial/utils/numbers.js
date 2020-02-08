import { Fragment } from 'react'
import { FormattedNumber } from 'react-intl'

export const shortNumberFormat = number => {
  if (number < 1000) {
    return <FormattedNumber value={number} />
  }

  return (
    <Fragment>
      <FormattedNumber value={number / 1000} maximumFractionDigits={1} />K
    </Fragment>
  )
}
