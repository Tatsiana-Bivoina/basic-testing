import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(10);
    expect(() => account.withdraw(20)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const from = getBankAccount(10);
    const to = getBankAccount(0);
    expect(() => from.transfer(20, to)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(50);
    expect(() => account.transfer(10, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(10);
    account.deposit(40);
    expect(account.getBalance()).toBe(50);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(50);
    account.withdraw(20);
    expect(account.getBalance()).toBe(30);
  });

  test('should transfer money', () => {
    const from = getBankAccount(70);
    const to = getBankAccount(5);
    from.transfer(20, to);
    expect(from.getBalance()).toBe(50);
    expect(to.getBalance()).toBe(25);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(0);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(77);
    await expect(account.fetchBalance()).resolves.toBe(77);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(10);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(88);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(88);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(10);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
