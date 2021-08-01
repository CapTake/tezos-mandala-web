import config from '../config'
import axios from 'axios'
import cache from 'js-cache'
import { shortAddress } from '../utils'

export default {
  getMetadata: async (address) => {
    let metadata = cache.get(address)
    if (!metadata) {
      try {
        const { data } = await axios.get(`${config.tzktapi}/v1/accounts/${address}/metadata`)
        metadata = data
        if (!metadata) throw Error('No data')
      } catch (e) {
        metadata = {
          address,
          owner: shortAddress(address)
        }
      } finally {
        cache.set(address, metadata, 1800000)
      }
    }
    return metadata
  },

  /*
    active
    boolean Nullable
    Filters keys by status: true - active, false - removed.

    key
    JsonParameter (object) Nullable
    Filters keys by JSON key. Note, this query parameter supports the following format: ?key{.path?}{.mode?}=..., so you can specify a path to a particular field to filter by, for example: ?key.token_id=....

    value
    JsonParameter (object) Nullable
    Filters keys by JSON value. Note, this query parameter supports the following format: ?value{.path?}{.mode?}=..., so you can specify a path to a particular field to filter by, for example: ?value.balance.gt=....

    lastLevel
    Int32Parameter (object) Nullable
    Filters bigmap keys by the last update level.

    select
    SelectParameter (object) Nullable
    Specify comma-separated list of fields to include into response or leave it undefined to return full object.
    If you select single field, response will be an array of values in both .fields and .values modes.

    sort
    SortParameter (object) Nullable
    Sorts bigmap keys by specified field. Supported fields: id (default), firstLevel, lastLevel, updates.

    offset
    OffsetParameter (object) Nullable
    Specifies which or how many items should be skipped

    limit
    integer <int32> [ 0 .. 10000 ]
    Default: 100
    Maximum number of items to return

    micheline
    MichelineFormat (integer)
    Default: 0
    Format of the bigmap key and value: 0 - JSON, 1 - JSON string, 2 - Micheline, 3 - Micheline string
  */
  getBigMapData: async (kt, name, params, ttl = 60000) => {
    const key = kt + name + JSON.stringify(params)
    let data = cache.get(key)
    if (!data) {
      const cnf = {
        params: {
          micheline: 0,
          ...params
        }
      }
      const res = await axios.get(`${config.tzktapi}/v1/contracts/${kt}/bigmaps/${name}/keys`, cnf)
      data = res.data
      cache.set(key, data, ttl || 10)
    }
    return data
  }
}
