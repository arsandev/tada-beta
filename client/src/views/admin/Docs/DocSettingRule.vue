<template>
  <div>
    <NavModule :doc="docsData.name" :menu="menu"/>
    <h5 class="mt-3">Aturan Dokumen</h5>
    Mengambil data dinamis pada <b>{{docsData.docs}}</b> untuk diubah menjadi sesuai dengan data pihak.
    <hr>
    <div v-if="parties.length < 1" class="alert alert-warning">
      Belum ada pihak yang anda tambahkan dalam dokumen ini.
      Harap menambahkan setidaknya 1 pihak terlibat.
      <div class="text-right">
        <router-link class="btn btn-primary btn-sm" :to="{ name: 'aDocSettingParty'}">Ke pengaturan pihak</router-link>
      </div>
    </div>
    <form method="post" @submit.prevent="saveRules()" v-else>
      <div class="row my-3" v-for="(v, index) in docVar" :key="index">
        <div class="col">
          <input type="text" readonly class="form-control" :value="`{${v.var}}`">
        </div>
        <div class="pt-2">
          ubah menjadi
        </div>
        <div class="col">
          <div class="row">
            <div class="col" v-if="parties.length > 0">
              <select class="form-control" v-model="v.partyId">
                <option value="">-PILIH PIHAK-</option>
                <option v-for="(p, index) in parties" :value="p.id" :key="index">{{p.name}}</option>
              </select>
            </div>
            <div class="pt-2">
              <i class="fa fa-arrow-right"></i>
            </div>
            <div class="col" v-if="v.partyId">
              <select v-model="v.selectedData" class="form-control">
                <option v-for="(p, index) in getColoum(v.partyId)" :key="index" :value="p.name">{{p.name}}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 text-right">
        <button type="submit" class="btn btn-primary btn-sm"><i class="fa fa-save"></i> Simpan</button>
      </div>
    </form>
  </div>
</template>
<script>
import NavModule from '@/components/NavModule.vue'
export default {
  components: {
    NavModule
  },
  props: ['docsData'],
  data() {
    return {
      docVar: [],
      parties: ['loading'],
      menu: [
        {
          name: "Halaman Utama Dokumen",
          to: {name: "aDocDetail"}
        },
        {
          name: "Pengaturan Pihak",
          to: {name: "aDocSettingParty"}
        }
      ]
    }
  },
  methods: {
    getColoum(partyId) {
      return JSON.parse(this.parties.find(x => x.id == partyId).data);
    },
    getDocVar() {
      this.axios.get(`${this.api}/docs/rules/${this.$route.params.id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).then(res => {
        let rules = res.data.res[0].rules
        if (rules !== '') {
          this.docVar = JSON.parse(rules)
        }
        else {
          this.axios.get(`${this.api}/docs/variable/${this.$route.params.id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(res => {
            for (var val of res.data.v) {
              this.docVar.push({
                var: val,
                partyId: '',
                selectedData: ''
              })
            }
          })
        }
      })
    },
    getParties() {
      this.axios.get(`${this.api}/doc_party/id_doc/${this.$route.params.id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).then(res => {
        this.parties = res.data.res
      })
    },
    saveRules() {
      this.axios.put(`${this.api}/docs/rules/${this.$route.params.id}`, {
        rules: this.docVar
      }, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).then(res => {
        if (res.data.status) {
          this.toastr.success("Berhasil menyimpan aturan dokumen!")
          this.getParties()
        } else {
          this.toastr.error("Terjadi kesalahan!")
        }
      })
    }
  },
  mounted() {
    this.getDocVar()
    this.getParties()
  }
}
</script>
