import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  let setTimeoutSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    setTimeoutSpy.mockRestore();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);
    jest.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let setIntervalSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    setIntervalSpy = jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    setIntervalSpy.mockRestore();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, 500);

    expect(setIntervalSpy).toHaveBeenCalledWith(callback, 500);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, 300);
    jest.advanceTimersByTime(900);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    (join as jest.Mock).mockReturnValue('/mocked/path/file.txt');
    (existsSync as jest.Mock).mockReturnValue(false);

    await readFileAsynchronously('file.txt');

    expect(join).toHaveBeenCalledWith(expect.any(String), 'file.txt');
  });

  test('should return null if file does not exist', async () => {
    (join as jest.Mock).mockReturnValue('/mocked/path/file.txt');
    (existsSync as jest.Mock).mockReturnValue(false);

    await expect(readFileAsynchronously('file.txt')).resolves.toBeNull();
    expect(readFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    (join as jest.Mock).mockReturnValue('/mocked/path/file.txt');
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from('hello world'));

    await expect(readFileAsynchronously('file.txt')).resolves.toBe(
      'hello world',
    );
    expect(readFile).toHaveBeenCalledWith('/mocked/path/file.txt');
  });
});
