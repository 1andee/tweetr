/**
@description: displays elapsed time from tweet creation
              nested if statements return singular 'minute/hour/day' versus plural
@params: timestamp, which is the unix time of when each tweet was created
*/

const timeElapsed = (timestamp) => {
  let difference =  ((Date.now() - timestamp) / 1000);
  let year = 31557600;

  // Less than 29 seconds
  if (difference < 29) {
    return `now`
  }
  // Returns # of seconds ago
  if (difference < 59) {
    let secondsAgo = Math.floor(difference);
    return `${secondsAgo} seconds ago`
  }

  // Returns # of minutes ago
  if (difference < 3599) {
    let minutesAgo = Math.floor(difference/60);
      if (minutesAgo < 2) {
        return `1 minute ago`
      }
    return `${minutesAgo} minutes ago`
  }

  // Returns # of hours ago
  if (difference < 86399) {
    let hoursAgo = Math.floor(difference/3600);
      if (hoursAgo < 2) {
        return `1 hour ago`
      }
    return `${hoursAgo} hours ago`
  }

  // Returns # of days ago
  if (difference < (year - 86400)) {
    let daysAgo = Math.floor(difference/86400);
      if (daysAgo < 2) {
        return `1 day ago`
      }
    return `${daysAgo} days ago`
  }

  // Returns # of years ago
  if (difference > (year - 86400)) {
    let yearsAgo = Math.floor(difference/year);
      if (yearsAgo < 2) {
        return `1 year ago`
      }
    return `${yearsAgo} years ago`
  }
}
