import moment from 'moment';

moment.locale('zh-CN');

export function formatDate(time) {
  return moment(time).format('YYYY/MM/DD HH:mm');
}
