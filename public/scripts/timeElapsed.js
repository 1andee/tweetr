/**
@description: displays elapsed time from tweet creation
@params: timestamp, which is the unix time each tweet was created
*/

const timeElapsed = (timestamp) => {
  let difference =  ((Date.now() - timestamp) / 1000);
  let year = 31557600;

  if (difference < 29) {
    return `now`
  }
  if (difference < 59) {
    var secondsAgo = Math.floor(difference);
    return `${secondsAgo} seconds ago`
  }
  if (difference < 3599) {
    var minutesAgo = Math.floor(difference/60);
      if (minutesAgo < 2) {
        return `1 minute ago`
      }
    return `${minutesAgo} minutes ago`
  }
  if (difference < 86399) {
    var hoursAgo = Math.floor(difference/3600);
      if (hoursAgo < 2) {
        return `1 hour ago`
      }
    return `${hoursAgo} hours ago`
  }
  if (difference < (year - 86400)) {
    var daysAgo = Math.floor(difference/86400);
      if (daysAgo < 2) {
        return `1 day ago`
      }
    return `${daysAgo} days ago`
  }
  if (difference > (year - 86400)) {
    var yearsAgo = Math.floor(difference/year);
      if (yearsAgo < 2) {
        return `1 year ago`
      }
    return `${yearsAgo} years ago`
  }
}
