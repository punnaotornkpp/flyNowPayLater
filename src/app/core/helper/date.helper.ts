import moment from 'moment-timezone';

export class DateTime {
  static setTimeZone(
    date: Date,
    timeZone = 'Asia/Bangkok',
    format = 'YYYY-MM-DD'
  ): string {
    return moment(date).tz(timeZone).format(format);
  }

  static dateIsGreaterThanToday(date: Date): boolean {
    return moment(Date.now()).isAfter(date);
  }
}
