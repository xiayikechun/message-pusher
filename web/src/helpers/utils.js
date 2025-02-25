import { toast } from 'react-toastify';
import { toastConstants } from '../constants';
import { API } from './api';

export function isAdmin() {
  let user = localStorage.getItem('user');
  if (!user) return false;
  user = JSON.parse(user);
  return user.role >= 10;
}

export function isRoot() {
  let user = localStorage.getItem('user');
  if (!user) return false;
  user = JSON.parse(user);
  return user.role >= 100;
}

export async function copy(text) {
  let okay = true;
  try {
    if (navigator.clipboard){
      await navigator.clipboard.writeText(text);
    } else {
      var textarea = document.createElement("textarea");

      textarea.value = text;

      textarea.style.opacity = 0;
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";

      document.body.appendChild(textarea);
      
      var range = document.createRange();
      range.selectNode(textarea);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      
      document.execCommand("copy");
      
      document.body.removeChild(textarea);
      window.getSelection().removeAllRanges();
    }
  }
   catch (e) {
    okay = false;
    console.error(e);
  }
  return okay;
}

export function isMobile() {
  return window.innerWidth <= 600;
}

let showErrorOptions = { autoClose: toastConstants.ERROR_TIMEOUT };
let showWarningOptions = { autoClose: toastConstants.WARNING_TIMEOUT };
let showSuccessOptions = { autoClose: toastConstants.SUCCESS_TIMEOUT };
let showInfoOptions = { autoClose: toastConstants.INFO_TIMEOUT };
let showNoticeOptions = { autoClose: false };

if (isMobile()) {
  showErrorOptions.position = 'top-center';
  // showErrorOptions.transition = 'flip';

  showSuccessOptions.position = 'top-center';
  // showSuccessOptions.transition = 'flip';

  showInfoOptions.position = 'top-center';
  // showInfoOptions.transition = 'flip';

  showNoticeOptions.position = 'top-center';
  // showNoticeOptions.transition = 'flip';
}

export function showError(error) {
  console.error(error);
  if (error.message) {
    if (error.name === 'AxiosError') {
      switch (error.response.status) {
        case 401:
          // toast.error('错误：未登录或登录已过期，请重新登录！', showErrorOptions);
          window.location.href = '/login?expired=true';
          break;
        case 429:
          toast.error('错误：请求次数过多，请稍后再试！', showErrorOptions);
          break;
        case 500:
          toast.error('错误：服务器内部错误，请联系管理员！', showErrorOptions);
          break;
        case 405:
          toast.info('本站仅作演示之用，无服务端！');
          break;
        default:
          toast.error('错误：' + error.message, showErrorOptions);
      }
      return;
    }
    toast.error('错误：' + error.message, showErrorOptions);
  } else {
    toast.error('错误：' + error, showErrorOptions);
  }
}

export function showWarning(message) {
  toast.warn(message, showWarningOptions);
}

export function showSuccess(message) {
  toast.success(message, showSuccessOptions);
}

export function showInfo(message) {
  toast.info(message, showInfoOptions);
}

export function showNotice(message) {
  toast.info(message, showNoticeOptions);
}

export function openPage(url) {
  window.open(url);
}

export function removeTrailingSlash(url) {
  if (url.endsWith('/')) {
    return url.slice(0, -1);
  } else {
    return url;
  }
}

export function timestamp2string(timestamp) {
  let date = new Date(timestamp * 1000);
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  let hour = date.getHours().toString();
  let minute = date.getMinutes().toString();
  let second = date.getSeconds().toString();
  if (month.length === 1) {
    month = '0' + month;
  }
  if (day.length === 1) {
    day = '0' + day;
  }
  if (hour.length === 1) {
    hour = '0' + hour;
  }
  if (minute.length === 1) {
    minute = '0' + minute;
  }
  if (second.length === 1) {
    second = '0' + second;
  }
  return (
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  );
}

export function downloadTextAsFile(text, filename) {
  let blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

export async function testChannel(username, token, channel) {
  let res = await API.post(`/push/${username}/`, {
    token,
    channel,
    title: '消息推送服务',
    description:
      channel === ''
        ? '消息推送通道测试成功'
        : `消息推送通道 ${channel} 测试成功`,
    content: '欢迎使用消息推送服务，这是一条测试消息。',
  });
  const { success, message } = res.data;
  if (success) {
    showSuccess('测试消息已发送');
  } else {
    showError(message);
  }
}

export const verifyJSON = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const generateToken = (byteNum) => {
  const bytes = crypto.getRandomValues(new Uint8Array(byteNum));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
};
