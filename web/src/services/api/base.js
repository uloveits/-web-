import api from '../../utils/request';

export default class base {
  static get = api.get;
  static put = api.put;
  static post = api.post;
  static delete = api.delete;
}