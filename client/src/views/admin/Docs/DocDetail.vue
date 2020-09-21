<template>
<div>
  <NavModule :doc="docsData.name" :menu="menu"/>
  <hr>
  <div class="row">
    <div class="col">
      <button class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg"><i class="fa fa-plus"></i> Tambah Salinan</button>
      <div class="modal fade bd-example-modal-lg" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Tambah Salinan Baru</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form method="post">
                <div v-for="(p, index) in parties" class="mb-3" :key="index">
                  <b>{{p.name}}</b>
                  <ModelSelect
                  :options="selectUser.options"
                  v-model="p.selected"
                  placeholder="PILIH USER" />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
              <button @click="newCopy()" type="button" class="btn btn-primary"><i class="fa fa-plus"></i> Tambah</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col text-right">
      Jumlah Salinan: <b>2</b> || Jumlah Pihak: <b>4</b>
    </div>
  </div>
  <div class="row my-4 text-center">
    <div class="col" v-for="(p, index) in parties" :key="index">
      <div class="row">
        <div class="col bg-primary text-white p-2" v-if="index == 0">Opsi</div>
        <div class="col bg-primary text-white p-2">{{p.name}}</div>
      </div>
      <div class="row">
        <div class="col" v-for="(pd, indexs) in partiesData" v-if="pd[p.name]">
          <div class="row" v-for="(pd2, index) in pd[p.name]">
            <div class="col p-3" v-if="indexs == 0">
              <a href="javascript:" class="text-danger" @click="deleteCopy(pd[p.name][0].id_copy_file)"><i class="fa fa-trash"></i></a>
            </div>
            <div class="col p-3">
              <router-link :to="{ name: 'aUsersDetail', params: {id: pd2.id_user} }">@{{pd2.username}}</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import NavModule from '@/components/NavModule.vue'
import {ModelSelect} from 'vue-search-select'
export default {
  components: {
    NavModule,
    ModelSelect
  },
  props: ['docsData'],
  data() {
    return {
      selectUser: {
        options: []
      },
      item: {},
      partiesData: [],
      parties: [],
      users: [],
      menu: [
        {
          name: "Pengaturan Pihak",
          to: {name: "aDocSettingParty"}
        },
        {
          name: "Aturan Dokumen",
          to: {name: "aDocSettingRule"}
        }
      ]
    }
  },
  methods: {
    deleteCopy(id){
      this.swal({
        title: "Hapus salinan ini?",
        text: "Ini akan menghapus salinan dan akses user pada dokumen ini.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          this.axios.delete(`${this.api}/doc_copy/copy_file/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(res => {
            if (res.data.status) {
              this.toastr.success("Berhasil menghapus salinan!")
              this.getPartiesData()
            } else {
              this.toastr.error("Gagal menghapus salinan!")
            }
          })
        }
      })
    },
    getPartiesData() {
      this.axios.get(`${this.api}/doc_party/id_doc/${this.$route.params.id}?onlyName=true`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).then(res => {
        this.partiesData = res.data.data
      })
    },
    newCopy() {
      this.swal({
        title: "Sedang Membuat Salinan Dokumen",
        text: "Mohon tunggu...",
        icon: "https://thumbs.gfycat.com/RelievedSilentArcticwolf-small.gif",
        button: false,
        closeOnClickOutside: false,
        closeOnEsc: false
      });
      this.axios.post(`${this.api}/doc_copy`, {
        data: this.parties
      }, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).then(res => {
        if (res.data.status) {
          this.getPartiesData()
          $("#exampleModal").modal("hide")
          this.swal("Sukses!", "Salinan berhasil ditambah", "success")
        }
        else this.toastr.error("Terjadi kesalahan!")
      })
    },
    getUsers() {
      this.axios.get(`${this.api}/users`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(res => {
        this.users = res.data.res
        for (var v of this.users) {
          this.selectUser.options.push({
            value: v.id,
            text: v.username
          })
        }
      })
    },
    getParties() {
      this.axios.get(`${this.api}/doc_party/id_doc/${this.$route.params.id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).then(res => {
        this.parties = res.data.res
        if (this.parties.length == 0) this.$router.push({name: "aDocSettingParty"})
      })
    }
  },
  mounted() {
    this.getParties()
    this.getPartiesData()
    this.getUsers()
  }
}
</script>
