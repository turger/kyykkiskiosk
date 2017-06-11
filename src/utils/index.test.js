import {
  minutesToDeparture,
} from './index'

const departureTimeHelper = (hours, minutes) => hours * 60 * 60 + minutes * 60
const currDate = new Date(2017, 0, 27)
const currDateInSeconds = new Date(2017, 0, 27).setHours(0,0,0,0) / 1000
const nextDateInSeconds = new Date(2017, 0, 28).setHours(0,0,0,0) / 1000
const createStopTime = (realtimeArrival, serviceDay) => ({ realtimeArrival, serviceDay })


describe('minutesToDeparture', () => {

  it('should return minutes to next departure', () => {
   expect(minutesToDeparture(createStopTime(departureTimeHelper(12, 15), currDateInSeconds), new Date(currDate.setHours(12, 0)) ))
    .toBe(15)
  })

  it('should return minutes to next departure after day change between 00:00-06:00', () => {
   expect(minutesToDeparture(createStopTime(departureTimeHelper(24, 10), currDateInSeconds), new Date(currDate.setHours(23, 59)) ))
    .toBe(11)
  })

  it('should return minutes to next departure between 00:00-06:00', () => {
   expect(minutesToDeparture(createStopTime(departureTimeHelper(26, 30), currDateInSeconds), new Date(currDate.setHours(2, 0)) ))
    .toBe(30)
  })

  it('should return minutes to next departure between 00:00-06:00 (2)', () => {
   expect(minutesToDeparture(createStopTime(departureTimeHelper(28, 30), currDateInSeconds), new Date(currDate.setHours(4, 25)) ))
    .toBe(5)
  })

  it('should return time to next departure after day change between 00:00-06:00 when more than 60 minutes to departure', () => {
   expect(minutesToDeparture(createStopTime(departureTimeHelper(28, 0), currDateInSeconds), new Date(currDate.setHours(23, 55)) ))
    .toBe('4:00')
  })

  it('should return time to next departure when departure time is on next day after 6:00', () => {
   expect(minutesToDeparture(createStopTime(departureTimeHelper(13, 0), nextDateInSeconds), new Date(currDate.setHours(23, 59)) ))
    .toBe('13:00')
  })

  it('should return minutes to next departure after serviceday change at 06:00', () => {
   expect(minutesToDeparture(createStopTime(departureTimeHelper(6, 30), currDateInSeconds), new Date(currDate.setHours(5, 55)) ))
    .toBe(35)
  })

  it('should return time to next departure when more than 60 minutes to departure', () => {
   expect(minutesToDeparture(createStopTime(departureTimeHelper(14, 0), currDateInSeconds), new Date(currDate.setHours(12, 0)) ))
    .toBe('14:00')
  })

  it('should return negative minutes', () => {
   expect(minutesToDeparture(createStopTime(departureTimeHelper(13, 0), currDateInSeconds), new Date(currDate.setHours(13, 5)) ))
    .toBe(-5)
  })

})
