export interface Theme {
  background: string;
  text: string;
  buttonBackground: string;
  buttonText: string;
  borderColor: string
}

export const lightTheme: Theme = {
  background: '#FFFFFF',
  text: '#000000',
  buttonBackground: '#E0E0E0',
  buttonText: '#000000',
  borderColor: '#2E2E2E',

};

export const darkTheme: Theme = {
  // background: '#2E2E2E',
  background: '#181818',
  text: '#E5E5E5',
  buttonBackground: '#3A3A3A',
  buttonText: '#E5E5E5',
  borderColor: '#2E2E2E',
};