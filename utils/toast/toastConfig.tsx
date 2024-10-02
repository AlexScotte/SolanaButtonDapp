import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

interface CustomToastProps {
  text1?: string | undefined;
  text2?: string | undefined;
  type: ToastType;
  props: any;
}

const CustomToast: React.FC<CustomToastProps> = ({ text1, text2, type }) => {
  const getBackgroundColor = (): string => {
    switch (type) {
      case 'success': return '#E8F5E9';
      case 'error': return '#FFEBEE';
      case 'info': return '#E3F2FD';
      default: return '#FFFFFF';
    }
  };

  const getBorderColor = (): string => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'info': return '#2196F3';
      default: return '#000000';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor(), borderLeftColor: getBorderColor() }]}>
      <Text style={styles.text1}>{text1}</Text>
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 6,
    minHeight: 60,
    flexShrink: 1,
    maxWidth: '90%',
  } as ViewStyle,
  text1: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 5,
  } as TextStyle,
  text2: {
    fontSize: 13,
  } as TextStyle,
});


export const toastConfig: ToastConfig = {
  success: (props) => <CustomToast {...props} type="success" props={props}/>,
  error: (props) => <CustomToast {...props} type="error" props={props}/>,
  info: (props) => <CustomToast {...props} type="info" props={props}/>,
};

// export const toastConfig: ToastConfig = {
//   success: (props) => (
//     <BaseToast
//       {...props}
//       style={{ borderLeftColor: '#4CAF50', backgroundColor: '#E8F5E9' }}
//       contentContainerStyle={{ paddingHorizontal: 15 }}
//       text1Style={{ fontSize: 15, fontFamily: 'bold', color: '#1B5E20' }}
//       text2Style={{ fontSize: 13, color: '#2E7D32' }}
//       text2NumberOfLines={0}
//     />
//   ),
//   error: (props) => (
//     <ErrorToast
//       {...props}
//       style={{ borderLeftColor: '#F44336', backgroundColor: '#FFEBEE' }}
//       text1Style={{ fontSize: 15, fontFamily: 'bold', color: '#B71C1C' }}
//       text2Style={{ fontSize: 13, color: '#C62828' }}
//       text2NumberOfLines={0}
//     />
//   ),
//   info: (props) => (
//     <BaseToast
//       {...props}
//       style={{ borderLeftColor: '#2196F3', backgroundColor: '#E3F2FD' }}
//       contentContainerStyle={{ paddingHorizontal: 15 }}
//       text1Style={{ fontSize: 15, fontFamily: 'bold', color: '#0D47A1' }}
//       text2Style={{ fontSize: 13, color: '#1565C0' }}
//       text2NumberOfLines={3}
//     />
//   )
// };