import moment from 'moment-timezone'

export const getTimeZone = () => {
  const localTimeZone = moment.tz.guess()
  return localTimeZone ? localTimeZone : "UTC"
}