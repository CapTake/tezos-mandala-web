import config from '@/config'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { char2Bytes, bytes2Char } from '@taquito/utils'
import axios from 'axios'

import { TezosToolkit, MichelCodecPacker, OpKind, compose } from '@taquito/taquito'
import { Tzip16Module, tzip16 } from '@taquito/tzip16'
import { Tzip12Module, tzip12 } from '@taquito/tzip12'

import api from '../app/api'
import { zarithIntDecode } from '../utils'

const tezos = new TezosToolkit(config.endpoint)
tezos.setPackerProvider(new MichelCodecPacker())
tezos.addExtension(new Tzip16Module())
tezos.addExtension(new Tzip12Module())
const wallet = new BeaconWallet(config.walletOptions)
tezos.setWalletProvider(wallet)

const subscribeOperation = tezos.stream.subscribeOperation({
  and: [
    { destination: config.contract }, // must be our action contract
    { kind: OpKind.TRANSACTION }
  ]
})

const pool = {}

async function getContract (kt) {
  if (!pool[kt]) {
    console.log('not in a pool', kt)
    pool[kt] = tezos.wallet.at(kt, compose(tzip16, tzip12))
  }
  return pool[kt]
}

// function tez2mutez (amount) {
//   return Math.floor(amount * 1_000_000)
// }

export default {

  async init ({ state, commit, dispatch }) {
    const contract = await getContract(config.contract)
    commit('contract', contract)

    await dispatch('syncStorage')
    if (await wallet.client.getActiveAccount()) {
      const address = await wallet.getPKH()
      commit('userAddress', address)
    }
    await dispatch('listAllMandalas')
    commit('initDone')
  },

  onTransactionStream ({ state }, cb) {
    subscribeOperation.on('data', cb)
  },

  offTransactionStream ({ state }, cb) {
    subscribeOperation.off('data', cb)
  },

  setBuyStatus ({ commit }, status) {
    commit('isBuying', status)
  },

  async connectWallet ({ state, commit }) {
    let activeAccount = await wallet.client.getActiveAccount()
    if (!activeAccount) {
      await wallet.requestPermissions({
        network: {
          type: config.network
        }
      })
      activeAccount = await wallet.client.getActiveAccount()
      if (!activeAccount) {
        throw new Error('Wallet not connected')
      }
    }
    const address = await wallet.getPKH()
    commit('userAddress', address)

    return !!state.userAddress
  },

  disconnectWallet ({ commit }) {
    wallet.clearActiveAccount().then(() => commit('userAddress', null))
  },

  async syncStorage ({ state, commit }) {
    const contract = await getContract(config.contract)
    const storage = await contract.storage()
    console.log(storage)
    commit('setNextId', storage.next_id.toNumber())
  },

  async getOneMandala ({ state, commit }, { id, owner }) {
    const contract = await getContract(config.contract)
    const storage = await contract.storage()

    // eslint-disable-next-line camelcase
    const { token_info } = await storage.token_metadata.get(id)
    console.log(token_info)

    // eslint-disable-next-line camelcase
    if (token_info) {
      const token = {
        id: parseInt(id),
        owner,
        rarity: 'Seed'
      }
      token_info.forEach((value, key) => {
        console.log(key, value)
        token[key] = ['date', 'nt'].includes(key) ? +zarithIntDecode(value) : bytes2Char(value)
      })
      if (token.artifactUri) {
        const [, xId] = token.artifactUri.split(':')
        token.data = await storage.metadata.get(xId)
      }
      commit('oneMandala', token)
    }
  },

  async listAllMandalas ({ state, commit, dispatch }) {
    try {
      commit('isLoading', true)
      const limit = 1124
      const active = true
      const items = {}
      const thumbs = await api.getBigMapData(config.contract, 'token_metadata', { 'select.values': 'key,value', limit, active })
      thumbs.forEach(el => {
        if (el[0] > 0) {
          const { name, date, nt, rarity, v } = el[1].token_info
          items[el[0]] = [
            rarity && name ? bytes2Char(name) : '',
            date ? +zarithIntDecode(date) : 0,
            nt ? +zarithIntDecode(nt) : 0,
            null,
            rarity ? bytes2Char(rarity) : 'Seed',
            null,
            v
          ]
        }
      })
      const ledger = await api.getBigMapData(config.contract, 'ledger', { 'select.values': 'key,value', limit, 'sort.asc': 'id' })
      ledger.forEach(el => {
        if (el[0] > 0) {
          items[el[0]][3] = el[1]
        }
      })
      commit('setItems', items)
    } catch (e) {
      commit('setStorageError', e)
    } finally {
      commit('isLoading', false)
    }
  },

  async readMandalasData ({ state, commit }, ids) {
    try {
      commit('isLoading', true)
      console.log(ids)
      ids = ids.filter(id => !state.graph[parseInt(id)])
      if (ids.length === 0) return
      const params = {
        active: true,
        'select.values': 'key,value'
      }

      const strIds = ids.map(el => (`00${Number(el).toString(16)}`).substr(-3).toUpperCase())
      console.log(strIds)
      if (strIds.length === 1) {
        params['key.eq'] = strIds[0]
      } else {
        params['key.in'] = strIds.join(',')
      }
      const thumbs = await api.getBigMapData(config.contract, 'metadata', params)
      commit('setGraphData', thumbs)
    } catch (e) {
      commit('setStorageError', e)
    } finally {
      commit('isLoading', false)
    }
  },

  async readMandalas ({ commit }) {
    try {
      commit('isLoading', true)
      const response = await axios.get(`https://tezos-mandala.art/static/${config.contract}.json`)
      if (response.data) commit('setItems', response.data)
      const v1 = await axios.get('https://tezos-mandala.art/static/cache.json')
      if (v1.data) commit('setV1Items', v1.data)
    } catch (e) {
      commit('setStorageError', e)
    } finally {
      commit('isLoading', false)
    }
  },

  async readV1Mandalas ({ commit }) {
    try {
      commit('isLoading', true)
      const response = await axios.get('https://tezos-mandala.art/static/cache.json')
      if (response.data) commit('setV1Items', response.data)
    } catch (e) {
      commit('setStorageError', e)
    } finally {
      commit('isLoading', false)
    }
  },
  async readMandalasOld ({ state, commit }, { offset, limit }) {
    try {
      commit('isLoading', true)
      console.log(offset, limit)
      const ids = Array.from({ length: limit || 1999 }, (e, i) => (offset || 1) + i)
      console.log(ids)
      const items = await state.contract.views.list_tokens(ids).read()

      commit('setItems', items)
    } catch (e) {
      commit('setStorageError', e)
    } finally {
      commit('isLoading', false)
    }
  },
  async renderMandala ({ commit, dispatch }, id) {
    try {
      await dispatch('connectWallet')
      commit('setAPIError', null)
      const contract = await getContract(config.contract)
      const op = await contract.methods.mint(id).send()
      const result = await op.confirmation()
      if (result.completed) {
        commit('setSuccess', `Mandala #${id} create transaction sent`)
        return true
      }
      throw new Error(`Mandala #${id}: Create transaction not confirmed`)
    } catch (e) {
      commit('setAPIError', e)
      console.log(e)
      return false
    }
  },
  async renderV1Mandala ({ commit, dispatch }, { id, bytes, signature }) {
    try {
      await dispatch('connectWallet')
      commit('setAPIError', null)

      const contract = await tezos.wallet.at(config.contract)
      const op = await contract.methods.render(id, bytes, signature).send()
      const result = await op.confirmation()
      if (result.completed) {
        commit('setSuccess', `V1 Mandala #${id} created successfully`)
        return true
      }
      throw new Error(`V1 Mandala #${id}: Create transaction not confirmed`)
    } catch (e) {
      commit('setAPIError', e)
      console.log(e)
      return false
    }
  },
  async renameMandala ({ commit, dispatch }, { id, name }) {
    try {
      await dispatch('connectWallet')
      commit('setAPIError', null)
      const contract = await tezos.wallet.at(config.contract)
      const namebytes = char2Bytes(name)
      const op = await contract.methods.name(id, namebytes).send()
      const result = await op.confirmation()
      if (result.completed) {
        commit('setSuccess', `Mandala #${id} renamed successfully`)
        commit('rename', { id, name })
        return true
      }
      throw new Error(`Mandala #${id}: rename transaction not confirmed`)
    } catch (e) {
      commit('setAPIError', e)
      console.log(e)
      return false
    }
  },
  async buySeed ({ commit, getters, dispatch }) {
    try {
      await dispatch('connectWallet')
      commit('setAPIError', null)
      const amount = getters.currentPrice
      const contract = await tezos.wallet.at(config.contract)
      const op = await contract.methods.buy(null).send({ amount, mutez: false })
      const result = await op.confirmation()
      if (result.completed) {
        commit('setSuccess', 'Buy Mandala Seed transaction confirmed')
        return true
      }
      throw new Error('Buy Mandala Seed: transaction not confirmed')
    } catch (e) {
      if (e.title === 'Aborted') return false
      commit('setAPIError', e)
      console.log(e)
      return false
    }
  },
  async transferToken ({ state, commit, dispatch }, { destination, id }) {
    try {
      await dispatch('connectWallet')
      commit('setAPIError', null)
      const contract = await tezos.wallet.at(config.contract)
      const op = await contract.methods.transfer([{ from_: state.userAddress, txs: [{ to_: destination, token_id: id, amount: 1 }] }]).send()
      const result = await op.confirmation()
      if (result.completed) {
        commit('setSuccess', `Send #${id} transaction confirmed`)
        return true
      }
      throw new Error(`Send #${id}: transaction not confirmed`)
    } catch (e) {
      if (e.title === 'Aborted') return false
      commit('setAPIError', e)
      console.log(e)
      return false
    }
  }
}
