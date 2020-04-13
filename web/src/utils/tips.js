import { Modal, Button } from 'antd';

const { confirm } = Modal;

export default class Tips {


  static confirm(title,content='',payload = {}) {

    return new Promise((resolve, reject) => {
      confirm({
        title: title,
        content: content,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          resolve(payload);
        },
        onCancel() {
          reject(payload);
        },
      });
    });

  }
}