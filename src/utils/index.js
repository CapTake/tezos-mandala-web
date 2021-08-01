import BigNumber from 'bignumber.js'
import { hex2buf } from '@taquito/utils'

export const shortAddress = (address, len = 4) => {
  return address.substr(0, 3 + len) + '...' + address.substr(-len)
}
// zarith signed int :  hex encode string 0500XXXXXX
export const zarithIntDecode = (hex) => {
  if (hex.substr(0, 4) !== '0500') throw new Error(`Bad Zarith int string: ${hex}`)
  const n = hex2buf(hex.substr(4))
  let mostSignificantByte = 0
  while (mostSignificantByte < n.length && (n[mostSignificantByte] & 128) !== 0) {
    mostSignificantByte += 1
  }
  let num = new BigNumber(0)
  for (let i = mostSignificantByte; i >= 0; i -= 1) {
    const tmp = n[i] & 0x7f
    num = num.multipliedBy(i > 0 ? 128 : 64)
    num = num.plus(tmp)
  }
  return new BigNumber(num).toString()
}
