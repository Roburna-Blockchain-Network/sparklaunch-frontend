import moment from "moment"

export const datetimeToTimestamp = data => {
  return moment(data).unix()
}
