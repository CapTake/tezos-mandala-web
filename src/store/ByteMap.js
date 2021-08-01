const ByteMap = {

  asBytes (data) {
    const entries = []
    let length = 0
    Object.keys(data)
      .sort()
      .forEach((v) => {
        const entry = this.packEntry(v, data[v])
        length += entry.length
        entries.push(entry)
      })
    const view = new DataView(new ArrayBuffer(6))
    view.setUint16(0, 0x0502)
    view.setUint32(2, length)

    return entries.reduce((a, e) => {
      return new Uint8Array([...a, ...e])
    }, new Uint8Array(view.buffer))
  },

  asHex (data) {
    return this.asBytes(data).reduce((a, v) => a + ('0' + v.toString(16)).slice(-2), '')
  },

  packEntry (key, value) {
    /* 0704 01 0000000b 6172746566616374557269 0a 0000001a ... */
    if (typeof value !== 'string' && !(value instanceof Uint8Array)) {
      console.log(key, value)
      throw new Error('Bad value type')
    }
    // console.log('>', key, value.length)

    const entryKey = this.packString(key)
    const entryVal = (typeof value === 'string') ? this.packBytes(this.strAsBytes(value)) : this.packBytes(value)

    const res = new Uint8Array(entryKey.length + entryVal.length)

    res[0] = 0x07
    res[1] = 0x04
    let offset = 2

    for (let i = 1; i < entryKey.length; i++) {
      res[offset] = entryKey[i]
      offset++
    }
    for (let i = 1; i < entryVal.length; i++) {
      res[offset] = entryVal[i]
      offset++
    }
    return res
  },
  strAsBytes (value) {
    const encoder = new TextEncoder()
    return encoder.encode(value)
  },
  packString (value) {
    const header = new DataView(new ArrayBuffer(6))
    const encoder = new TextEncoder()
    const bytes = encoder.encode(value)
    header.setUint16(0, 0x0501)
    header.setUint32(2, value.length)
    const res = new Uint8Array(6 + value.length)
    for (let i = 0; i < 6 + value.length; i++) {
      if (i < 6) {
        res[i] = header.getUint8(i)
      } else {
        res[i] = bytes[i - 6]
      }
    }
    return res
  },
  packBytes (bytes) {
    const header = new DataView(new ArrayBuffer(6))
    header.setUint16(0, 0x050a)
    header.setUint32(2, bytes.length)
    const res = new Uint8Array(6 + bytes.length)
    for (let i = 0; i < 6 + bytes.length; i++) {
      if (i < 6) {
        res[i] = header.getUint8(i)
      } else {
        res[i] = bytes[i - 6]
      }
    }
    return res
  }
}

module.exports = ByteMap
