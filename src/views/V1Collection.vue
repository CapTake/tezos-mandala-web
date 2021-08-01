<template>
    <section class="d-flex flex-column justify-center subpage contain">
      <h1 class="text-h4 text-lg-h2 text-md-h3 mb-10 mx-3 text-center mt-16">{{ title }}</h1>
    <v-divider />
    <v-tabs v-model="tab" background-color="white" color="orange" :show-arrows="false" prev-icon="-" grow>
      <v-tab v-for="(item, i) in tabs" :key="item+i">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-divider />
    <h2 class="text-lg-h4 text-md-h5 mx-2 text-center mt-8 mb-4 font-weight-light">{{ type ? type : 'All' }}({{ listed.length }})</h2>

    <p class="pt-6 pl-4">
        <label v-if="type !== 'Seed' && listed.length" class="text-subtitle-1">
          Sort by:
          <select class="sort-select" v-model="sort">
            <option v-for="o in sortItems" :value="o" :key="o">{{ o }}</option>
          </select>
        </label>
    </p>
    <v-row v-if="paged.length" class="py-5" style="max-width: 100vw" :key="sort">
      <template v-for="item in paged">
        <v-col :key="item.id" md="4" sm="6" style="min-width: 290px">
          <mandala-card :item="item" :actions="true" default-uri="/seed.png" @send="showSendDialog" @rename="showRenameDialog" @convert="renderMandala" />
        </v-col>
      </template>
      <v-col sm="12" v-if="more" class="text-center">
          <v-btn @click="page++">SHOW MORE</v-btn>
      </v-col>
    </v-row>
    <v-row v-else class="py-5">
      <empty-space title="Nothing here yet :(" show-buy-button @buy="setBuyStatus(true)" />
    </v-row>
    <send-dialog :show="sendDialog" :token="selectedToken" @input="confirmSend" />
    <rename-dialog :name="tokenName" :show="renameDialog" @input="confirmRename" />
    </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { saveSvgAsPng } from 'save-svg-as-png'
import EmptySpace from '../components/Empty'
import SendDialog from '../components/SendDialog'
import RenameDialog from '../components/RenameDialog'
import MandalaCard from '../components/AdminCard'
import { shortAddress } from '../utils'

export default {
  props: {
    title: String,
    byUser: Boolean
  },
  components: {
    EmptySpace,
    SendDialog,
    RenameDialog,
    MandalaCard
  },
  filters: {
    shortAddress
  },
  data: () => ({
    tab: 0,
    page: 0,
    pageSize: 9,
    tabs: [
      'All',
      'Migrated',
      'Waiting'
    ],
    sort: 'Id',
    sortItems: ['Id', 'Price'],
    selectedToken: null,
    sendDialog: false,
    renameDialog: false
  }),
  watch: {
    byUser: {
      handler (v) {
        if (v) this.connectWallet()
      },
      immediate: true
    }
  },
  mounted () {
    this.page = 0
  },
  methods: {
    ...mapActions(['connectWallet', 'renderMandala', 'transferToken', 'renameMandala', 'setBuyStatus']),
    savePng (id) {
      try {
        const el = document.getElementById(id).querySelector('svg')
        // console.log(el)
        saveSvgAsPng(el, `${id}.png`, { scale: 5 })
      } catch (ignore) {
        // console.log(ignore)
      }
    },
    showSendDialog (item) {
      this.sendDialog = !!item
      this.selectedToken = item
    },
    showRenameDialog (item) {
      this.renameDialog = !!item
      this.selectedToken = item
    },
    confirmSend (destination) {
      this.sendDialog = false
      if (destination) {
        this.transferToken({ destination, id: this.selectedToken.id })
      }
      this.selectedToken = null
    },
    confirmRename (name) {
      this.renameDialog = false
      if (typeof name === 'string') {
        this.renameMandala({ name, id: this.selectedToken.id })
      }
      this.selectedToken = null
    }
  },
  computed: {
    ...mapGetters(['getFilteredV1', 'isConnected']),
    ...mapState(['loading', 'userAddress']),
    owner () {
      return this.byUser ? (this.userAddress ? this.userAddress : 'disconnected') : null
    },
    comparator () {
      const comp = {
        Rarity (a, b) {
          const rare = ['Tezos', 'Eye', 'Unique', 'Seed']
          return rare.indexOf(a.rarity) - rare.indexOf(b.rarity)
        },
        Id: (a, b) => a.id - b.id,
        Price: (a, b) => a.id - b.id,
        New: (a, b) => b.date - a.date,
        Name (a, b) {
          if (a.name === b.name) return 0
          if (!a.name) return 1
          if (!b.name) return -1
          if (a.name > b.name) return 1
          return -1
        }
      }
      return comp[this.sort]
    },
    type () {
      const type = this.tabs[this.tab]
      return type === 'All' ? '' : type
    },
    tokenName () {
      return this.selectedToken ? this.selectedToken.name : ''
    },
    sortBy () {
      return this.sortItems[this.sort]
    },
    needsSort () {
      return this.type !== 'Seed' && this.listed.length
    },
    more () {
      return this.paged.length !== this.listed.length
    },
    paged () {
      return this.listed.filter((e, i) => (this.page * this.pageSize + this.pageSize) > i)
    },
    listed () {
      const res = this.getFilteredV1(this)
      return res
    }
  }
}
</script>
<style>
 .sort-select {
     color: orange;
     padding: 0 8px
 }
</style>
