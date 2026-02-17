// jest.setup.js
import { jest } from '@jest/globals';


global.FormData = class {
  constructor() {
    this._parts = [];
  }
  append(key, value, fileName) {
    this._parts.push({ key, value, fileName });
  }
  getParts() {
    return this._parts;
  }
};


// 1. Mock Platform globally (This runs BEFORE FormData loads)
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: () => null,
}));


jest.mock('uuid', () => ({
  v4: () => '00000000-0000-0000-0000-000000000000'
}));


