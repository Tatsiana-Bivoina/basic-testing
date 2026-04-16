import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const makeAxiosClientMock = (getMock: jest.Mock) =>
    ({ get: getMock }) as unknown as ReturnType<typeof axios.create>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: { id: 1 } });
    mockedAxios.create.mockReturnValue(makeAxiosClientMock(getMock));

    await throttledGetDataFromApi('/posts/1');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: { ok: true } });
    mockedAxios.create.mockReturnValue(makeAxiosClientMock(getMock));

    await throttledGetDataFromApi('/comments/1');

    expect(getMock).toHaveBeenCalledWith('/comments/1');
  });

  test('should return response data', async () => {
    const responseData = { title: 'my post' };
    const getMock = jest.fn().mockResolvedValue({ data: responseData });
    mockedAxios.create.mockReturnValue(makeAxiosClientMock(getMock));

    await expect(throttledGetDataFromApi('/posts/1')).resolves.toEqual(
      responseData,
    );
  });
});
