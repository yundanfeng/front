function ajax(option) {
  // 创建一个 XMLHttpRequest 对象
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
    requestData = option.data,
    requestUrl = option.url,
    requestMethod = option.method;
  // 如果是GET请求，需要将option中的参数拼接到URL后面
  if ('POST' != requestMethod && requestData) {
    var query_string = '';
    // 遍历option.data对象，构建GET查询参数
    for(var item in requestData) {
      query_string += item + '=' + requestData[item] + '&';
    }
    // 注意这儿拼接的时候，需要判断是否已经有 ?
    requestUrl.indexOf('?') > -1
      ? requestUrl = requestUrl + '&' + query_string
      : requestUrl = requestUrl + '?' + query_string;
    // GET 请求参数放在URL中，将requestData置为空
    requestData = null;
  }
  // ajax 请求成功之后的回调函数
  xhr.onreadystatechange = function () {
    // readyState=4表示接受响应完毕
    if (xhr.readyState == ("number" == typeof XMLHttpRequest.DONE ? XMLHttpRequest.DONE : 4)) {
      if (200 == xhr.status) { // 判断状态码
        var response = xhr.response || xhr.responseText || {}; // 获取返回值
        // if define success callback, call it, if response is string, convert it to json objcet
        console.log(response);
        option.success && option.success(response); // 调用回调函数处理返回数据
        // 可以判断返回数据类型，对数据进行JSON解析或者XML解析
        // option.success && option.success('string' == typeof response ? JSON.parse(response) : response);
      } else {
        // if define error callback, call it
        option.error && option.error(xhr, xhr.statusText);
      }
    }
  };
  // 发送ajax请求
  xhr.open(requestMethod, requestUrl, true);
  // 请求超时的回调
  xhr.ontimeout = function () {
    option.timeout && option.timeout(xhr, xhr.statusText);
  };
  // 定义超时时间
  xhr.timeout = option.timeout || 0;
  // 设置响应头部，这儿默认设置为json格式，可以定义为其他格式，修改头部即可
  xhr.setRequestHeader && xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
  xhr.withCredentials = (option.xhrFields || {}).withCredentials;
  // 这儿主要用于发送POST请求的数据
  xhr.send(requestData);
}