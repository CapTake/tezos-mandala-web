import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import config from '../config'
import { hex2buf } from '@taquito/utils'
// import zarith from '../tezos-sign/Zarith'
const metadata = require('./precached.json')
const snapshot = require('./v1.json')
const ByteMap = require('./ByteMap')

const ITEMSKEY = 'mandalas'
const GRAPHICS = 'metadata'
const items = JSON.parse(localStorage.getItem(ITEMSKEY)) || {}
const graph = JSON.parse(localStorage.getItem(GRAPHICS)) || {}

metadata.forEach(it => {
  const key = parseInt(it[0], 16)
  if (isNaN(key)) return
  graph[key] = it[1]
})

Vue.use(Vuex)

const NAME = 0
const CRDATE = 1
const NAMEDATE = 2
const OWNER = 3
const RARITY = 4
const DATA = 5
const VERSION = 6

export default new Vuex.Store({
  state: {
    snapshot,
    init: false,
    contract: null,
    signer: null,
    storageError: null,
    APIError: null,
    opSuccess: null,
    nextId: 0,
    loading: false,
    userAddress: null,
    isBuying: false,
    config,
    items,
    graph,
    v1Items: {}
  },
  mutations: {
    setStorageError (state, error) {
      state.storageError = error
    },
    setAPIError (state, error) {
      if (!error) {
        state.APIError = null
        return
      }
      let text = error.title || error.message || error.name
      if (error.name === 'TransactionInvalidBeaconError') {
        const data = error.data.find(d => d.with)
        if (data && data.with) {
          text = data.with.string || text
        }
      }
      state.APIError = text
    },
    setNextId (state, nextId) {
      state.nextId = nextId
    },
    initDone (state) {
      state.init = true
    },
    contract (state, contract) {
      state.contract = contract
    },
    setMintSigner (state, signer) {
      state.signer = signer
    },
    userAddress (state, address) {
      state.userAddress = address
    },
    setSuccess (state, success) {
      state.opSuccess = success
    },
    setItems (state, payload) {
      if (!payload) return
      const items = { ...state.items }
      const max = state.config.totalMandalas + 1
      Object.keys(payload).filter(k => k >= 1 && k <= max).forEach(k => {
        const value = payload[k]
        if (Array.isArray(value)) items[k] = value
      })
      state.items = items
      localStorage.setItem(ITEMSKEY, JSON.stringify(state.items))
    },
    oneMandala (state, payload) {
      const item = state.items[payload.id] || []
      item[NAME] = payload.name
      item[CRDATE] = payload.date || 0
      item[NAMEDATE] = payload.nt || 0
      item[RARITY] = payload.rarity
      item[DATA] = payload.data || null
      item[VERSION] = payload.v
      item[OWNER] = payload.owner || item[OWNER]
      state.items[payload.id] = item
    },
    setGraphData (state, payload) {
      if (!payload) return
      payload.forEach(el => {
        const id = parseInt(el[0], 16)
        if (!isNaN(id)) state.graph[id] = el[1]
      })
      localStorage.setItem(GRAPHICS, JSON.stringify(state.graph))
    },
    rename (state, { id, name }) {
      if (state.items[id]) {
        state.items[id][NAME] = name
      }
    },
    setV1Items (state, payload) {
      if (!payload) return
      const items = { ...state.items }
      const max = 579 // state.config.totalMandalas + 1
      Object.keys(payload).filter(k => k >= 1 && k <= max).forEach(k => {
        const value = payload[k]
        if (Array.isArray(value)) items[k] = value
      })
      state.v1Items = items
    },
    isLoading (state, loading) {
      state.loading = loading
    },
    isBuying (state, status) {
      state.isBuying = status
    }
  },

  getters: {
    currentPrice (state) {
      const id = state.nextId
      if (id >= 1120) return 100
      if (id >= 1110) return 95
      if (id >= 1095) return 90
      if (id >= 1075) return 85
      if (id >= 1050) return 80
      if (id >= 1020) return 75
      if (id >= 985) return 70
      if (id >= 945) return 65
      if (id >= 900) return 60
      if (id >= 850) return 55
      if (id >= 795) return 50
      if (id >= 735) return 45
      if (id >= 600) return 35
      if (id >= 500) return 30
      if (id >= 400) return 25
      if (id >= 300) return 20
      if (id >= 200) return 15
      if (id >= 100) return 10
      return 5
    },
    unsold (state) {
      return state.config.totalMandalas - state.nextId + 1
    },
    contractLink (state) {
      return `https://better-call.dev/mainnet/${state.config.contract}/`
    },
    totalMandalas (state) {
      return state.config.totalMandalas
    },
    isConnected (state) {
      return !!state.userAddress
    },
    getV1Mandala: ({ v1Items }) => (id) => {
      const mandala = v1Items[id]
      if (!mandala || !mandala[DATA]) throw new Error('NOT A MANDALA ' + id)

      const rare = mandala[RARITY]

      const date = hex2buf(mandala[CRDATE] || '0500bdb9a7850c')

      const hexdata = mandala[DATA] /// to ByteArray

      const name = mandala[NAME]

      const hexId = ('00' + parseInt(id).toString(16).toUpperCase()).slice(-3)

      const artifactUri = `tezos-storage:${hexId}`

      const packedMap = ByteMap.asBytes({
        [hexId]: hex2buf(hexdata),
        name,
        rarity: rare,
        symbol: `M${hexId}`,
        date,
        decimals: '0',
        shouldPreferSymbol: 'false',
        thumbnailUri: `https://tezos-mandala.art/static/${id}.png`,
        v: 'A',
        artifactUri
      })
      return packedMap // Uint8Array
    },

    getFiltered: (state) => ({ type, comparator, owner }) => Object.entries(state.items)
      .filter(
        e => e[0] > 0 && (!type || e[1][RARITY] === type) && (!owner || e[1][OWNER] === owner)
      )
      .map((kv) => {
        return {
          id: kv[0],
          name: kv[1][NAME],
          date: kv[1][CRDATE],
          nameTime: kv[1][NAMEDATE],
          owner: kv[1][OWNER],
          rarity: kv[1][RARITY],
          data: state.graph[kv[0]] || null,
          version: kv[1][VERSION]
        }
      }).sort(comparator),

    getFilteredV1: ({ v1Items }) => ({ type, comparator }) => Object.entries(v1Items)
      .filter(
        e => e[0] > 0 && (!type || (type === 'Migrated' && e[1][OWNER] === 'tz1V2V2V2V2V2V2V2V2V2V2V2V2V2V5XuRKx') || (type === 'Waiting' && e[1][OWNER] !== 'tz1V2V2V2V2V2V2V2V2V2V2V2V2V2V5XuRKx'))
      )
      .map((kv) => {
        return {
          id: kv[0],
          name: kv[1][NAME],
          date: kv[1][CRDATE],
          nameTime: kv[1][NAMEDATE],
          owner: kv[1][OWNER],
          rarity: kv[1][RARITY],
          data: kv[1][DATA],
          version: kv[1][VERSION]
        }
      }).sort(comparator)
  },
  actions,
  modules: {
  }
})
