
export default class CommonFnc {

  /**
   * 调用时不用把参数补全; getValue(array, key) 一样可以调用
   * @param array 数组
   * @param key 指定的数值
   * @returns {string|string|string}
   */
  static getConstantValue(array, key, strKey, strValue) {
    let result = 0;
    let _strKey = 'id';
    let _strValue = 'value';
    if(strKey) {
      _strKey = strKey;
    }
    if(strValue) {
      _strValue = strValue;
    }
    if (array) {
      for (let item of array) {
        if (key == item[_strKey]) {
          result = item[_strValue];
        }
      }
    }
    return result;
  }

  /**
   * 数组转字符串
   * @param arr
   * @returns {string}
   */
  static arrToString = (arr) => {
    let _str = '';
    for(let i= 0; i< arr.length;i++) {
      if(i === arr.length - 1){
        _str += arr[i]
      }else {
        _str += arr[i] + ','
      }
    }
    return _str;
  }

  /**
   * 字符串转数组
   * @param str
   * @returns {*}
   */
  static stringToArr = (str) => {
    if(str) {
      let arr = str.split(',');
      let _arr = [];
      for(let i= 0; i< arr.length; i++) {
        let _value = arr[i];
        _arr.push(_value);
      }
      return _arr;
    }else {
      return '';
    }
  }

  /**
   * 去掉字符串两端空格
   */
  static trim(str) {
    const reg = /^\s*|\s*$/g;
    return str.replace(reg, "");
  }

  /**
   * sku数据渲染
   */
  static cartesianProductOf() {
    return Array.prototype.reduce.call(arguments,function(a, b) {
      var ret = [];
      a.forEach(function(a) {
        b.forEach(function(b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    }, [[]]);
  }

  /**
   * 分转化成元
   */
  static centToYuan(cent) {
    let res = parseInt(cent)/100;
    res = res.toFixed(2);
    return res;
  }

  /**
   * 元转化成分
   */
  static yuanToCent(yuan) {
    return yuan * 100;
  }

  /**
   * 找到数组中某个值的下标
   */
  static findArrIndex(value,arr,prop='id') {
    for(let i = 0;i < arr.length;i++) {
      if(arr[i][prop] === value) {
        return i;
      }
    }
    return -1
  }

}


