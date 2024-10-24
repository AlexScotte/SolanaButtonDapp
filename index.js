/**
 * @format
 */
import {Buffer} from 'buffer';
import 'react-native-get-random-values';

global.Buffer = Buffer;

global.structuredClone = val => {
    return JSON.parse(JSON.stringify(val))
}

Buffer.prototype.subarray = function subarray(
//   begin: number | undefined,
//   end: number | undefined
  begin,
  end
) {
  const result = Uint8Array.prototype.subarray.apply(this, [begin, end]);
  Object.setPrototypeOf(result, Buffer.prototype); // Explicitly add the `Buffer` prototype (adds `readUIntLE`!)
  return result;
};

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Mock event listener functions to prevent them from fataling.
window.addEventListener = () => {};
window.removeEventListener = () => {};
window.Buffer = Buffer;

AppRegistry.registerComponent(appName, () => App);
