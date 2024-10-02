import {Alert} from 'react-native';

import Toast, { ToastType } from 'react-native-toast-message';

const showToast = (
    type: ToastType | undefined, 
    text1: string | undefined, 
    text2: string | undefined = '', 
    visibilityTime: number | undefined = 5000
  ) => {

  const emoji = type === 'success' ? '🟩' : type === 'error' ? '🟥' : '🟨';
  console.log(`${emoji} Toast displayed - ${type}: ${text1} - ${text2}`);

  Toast.show({
    type,
    text1,
    text2,
    position: 'bottom',
    visibilityTime: visibilityTime,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
  });
};

export const toastSuccess = (message: string, description: string = '') => {
  showToast('success', message, description);
};

export const toastError = (message: string, description: string = '') => {
  showToast('error', message, description);
};

export const toastInfo = (message: string, description: string = '') => {
  showToast('info', message, description);
};

