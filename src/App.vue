<template>
  <v-app>
    <v-app-bar app color="white" elevate-on-scroll flat style="max-width: 1160px; margin: 0 auto;">
      <v-btn icon x-small color="white" to="/" class="ml-2">
        <v-img :src="require('./assets/logo.png')" contain width="24px" />
      </v-btn>
      <v-toolbar-title class="pl-3">
        <router-link to="/" class="text-decoration-none black--text">
        Tezos Mandala
        </router-link>
      </v-toolbar-title>
      <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="orange" />
      <v-spacer />
      <div :class="{ 'top-menu': true, open: tbMenu }">
        <v-btn plain text to="/#why-tezos-mandala">Why Mandala</v-btn>
        <v-btn plain  text to="/explore">Explore</v-btn>
        <v-btn plain text to="/my-collection">My collection</v-btn>
        <v-menu v-if="isConnected" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-chip color="accent" label outlined v-on="on" v-bind="attrs">{{ userAddress | shortAddress }}</v-chip>
          </template>
          <v-list>
            <!--
            <v-list-item to="/v1" link>
              <v-list-item-title>Migration</v-list-item-title>
            </v-list-item>
            -->
            <v-list-item link>
              <v-list-item-title @click="disconnectWallet">Disconnect wallet</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-chip v-else color="accent" label outlined @click="connectWallet">Connect Wallet</v-chip>
      </div>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="tbMenu = !tbMenu">
        <v-icon v-if="tbMenu">fa fa-times</v-icon>
      </v-app-bar-nav-icon>
    </v-app-bar>
    <div>
      <v-main>
        <router-view />
      </v-main>
    </div>
    <footer class="footer py-15 px-4 mt-12">
      <v-row style="width: 1140px; max-width: 100%; margin: 0 auto;">
        <v-col class="text-left">
          <div class="mb-4">
          #Buttonists
          </div>
          <div>
          #TezosDeFiHackathon
          </div>
          <div class="mt-4">
            Powered by <a href="https://tzkt.io" target="_blank" rel="noopener">tzkt.io</a> API
          </div>
        </v-col>
        <v-col class="text-right pt-3">
          <a :href="contractLink" target="_blank" rel="noopener"><v-icon color="primary" dense>fa fa-chain</v-icon></a>
          <a href="https://twitter.com/buttonists" target="_blank" rel="noopener"><v-icon color="primary" dense>fa fa-twitter</v-icon></a>
          <a href="https://t.me/buttonists" target="_blank" rel="noopener"><v-icon color="primary" dense>fa fa-send</v-icon></a>
          <a href="https://github.com/Timikcool/tezos-mandala" target="_blank" rel="noopener"><v-icon color="primary" dense>fa fa-github</v-icon></a>
        </v-col>
      </v-row>
    </footer>
    <v-snackbar v-model="error1" multi-line app bottom left color="red">
      {{ storageError }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="error1 = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="error2" multi-line app bottom left color="red">
      {{ APIError }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="error1 = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="success" multi-line app top right color="success" :timeout="2000">
      {{ opSuccess }}
    </v-snackbar>
    <buy-dialog :show="isBuying" @input="confirmBuy" />
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import BuyDialog from '@/components/BuyDialog'
import { shortAddress } from './utils'
import { bytes2Char } from '@taquito/utils'

export default {
  name: 'App',
  data: () => ({
    tbMenu: false
  }),
  filters: {
    shortAddress
  },
  components: {
    BuyDialog
  },
  computed: {
    ...mapState(['nextId', 'loading', 'storageError', 'APIError', 'opSuccess', 'userAddress', 'isBuying']),
    ...mapGetters(['contractLink', 'isConnected']),
    error1: {
      get () {
        return this.storageError !== null
      },
      set (v) {
        if (!v) {
          this.$store.commit('setStorageError', null)
        }
      }
    },
    error2: {
      get () {
        return this.APIError !== null
      },
      set (v) {
        if (!v) {
          this.$store.commit('setAPIError', null)
        }
      }
    },
    success: {
      get () {
        return this.opSuccess !== null
      },
      set (v) {
        if (!v) {
          this.$store.commit('setSuccess', null)
        }
      }
    }
  },
  methods: {
    ...mapActions(['init', 'connectWallet', 'disconnectWallet', 'buySeed', 'setBuyStatus']),
    confirmBuy (confirmed) {
      if (confirmed) this.buySeed()
      this.setBuyStatus(false)
    },
    async onTransaction (data) {
      console.log('transaction', data)
      try {
        const param = data?.parameters?.value || []
        switch (data?.parameters?.entrypoint) {
          case 'buy':
            await this.$store.dispatch('syncStorage')
            await this.$store.dispatch('getOneMandala', { id: this.nextId - 1, owner: data.source })
            break
          case 'name':
            this.$store.commit('rename', { id: param.args[0].int, name: bytes2Char(param.args[1].bytes) })
            break
          case 'mint':
            await this.$store.dispatch('getOneMandala', { id: param?.int, owner: data.source })
            break
          case 'render':
            await this.$store.dispatch('getOneMandala', { id: param.args[0].int })
            break
        }
      } catch (e) {
        console.log(e)
      }
      await this.$store.dispatch('listAllMandalas')
      this.$forceUpdate()
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.$store.dispatch('onTransactionStream', this.onTransaction)
  },
  watch: {
    $route () { this.tbMenu = false }
  }
}
</script>
<style>
  .subpage {
    min-height:calc(100vh - 64px - 16px);
    padding-bottom: 40px;
  }
  @media screen and (max-width: 959px) {
    html {
      font-size: 14px;
    }
    .top-menu {
      background: #fff;
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      display: none;
      border-bottom: 1px solid rgba(0,0,0,0.2);
      padding: 16px;
    }
    .top-menu.open {
      display: flex;
      flex-direction: column;
    }
    .top-menu.open .v-chip {
      width: fit-content;
      align-self: center;
    }
    .v-main {
      overflow-x: hidden;
    }
    .v-main .row {
      margin: 0
    }
    .row .col {
      padding: 12px 0;
    }

  }
  .footer {
    background: #dddddd;
  }
  .footer a {
    text-decoration: none;
    padding: 0 8px;
  }
  .footer a:hover {
    color:#5f96eb !important
  }
  .contain {
     width: 1140px;
     max-width: 100vw;
     margin: 0 auto;
  }

</style>
