import { isAddress } from '@ethersproject/address';
import { Mnemonic, isValidMnemonic } from '@ethersproject/hdnode';
import { parseEther } from '@ethersproject/units';
import BigNumber from 'bignumber.js';


import { PrivateKey } from '../keychain/IKeychain';
import { ethUnits } from '../references';
import { EthereumWalletType } from '../types/walletTypes';

import { addHexPrefix, isHexStringIgnorePrefix } from './hex';
import { divide } from './numbers';


export type EthereumWalletSeed = PrivateKey | Mnemonic['phrase'];

const validTLDs = ['eth', 'xyz', 'luxe', 'kred', 'reverse', 'addr', 'test'];
export const isENSAddressFormat = (name: string) => {
  if (!name) return false;
  const tld = name.split('.').at(-1);
  if (!tld || tld === name) return false;
  return validTLDs.includes(tld.toLowerCase());
};

/**
 * @desc Checks if a string is a valid private key.
 * @param value The string.
 * @return Whether or not the string is a valid private key string.
 */
export const isValidPrivateKey = (value: string): boolean => {
  return isHexStringIgnorePrefix(value) && addHexPrefix(value).length === 66;
};

export const identifyWalletType = (
  walletSeed: EthereumWalletSeed,
): EthereumWalletType => {
  if (isValidPrivateKey(walletSeed)) {
    return EthereumWalletType.privateKey;
  }
  // 12 or 24 words seed phrase
  if (isValidMnemonic(walletSeed)) {
    return EthereumWalletType.mnemonic;
  }
  // Public address (0x)
  if (isAddress(walletSeed)) {
    return EthereumWalletType.readOnly;
  }
  // seed
  return EthereumWalletType.seed;
};



export const gweiToWei = (gweiAmount: string) => {
  const weiAmount = new BigNumber(gweiAmount).times(ethUnits.gwei).toFixed(0); // fixed to 0 because wei is the smallest unit
  return weiAmount;
};

export const weiToGwei = (weiAmount: string) => {
  const gweiAmount = divide(weiAmount, ethUnits.gwei);
  return gweiAmount;
};

export const toWei = (ether: string): string => {
  const result = parseEther(ether);
  return result.toString();
};




