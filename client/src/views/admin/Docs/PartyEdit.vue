<template>
  <div>
    <NavModule :doc="docsData.name" :menu="menu"/>
    <form @submit.prevent="updateParty()" method="post" class="mt-3">
      <div class="mb-4">
        <h5>Nama Pihak</h5>
        <i>Nama atau alias pihak. Contoh: kepala sekolah, sekretaris, ketua umum.</i>
        <hr>
        <input type="text" required v-model="user.name" autocomplete="off" class="form-control mb-1" ref="name" placeholder="masukan nama pihak">
      </div>
      <div class="mb-2">
        <h5>Data</h5>
        <i>Isi dari data ini akan dipakai di file dokumen.</i>
        <hr>
        <div v-for="(ad, index) in user.data" :key="index" class="row mb-3">
          <div class="col">
            <input type="text" autocomplete="off" v-model="ad.name" class="form-control" placeholder="nama data">
          </div>
          <div class="col-md-3">
            <div class="custom-control custom-checkbox" title="Jika diceklis, user di pihak ini harus mengisi data ini sebelum tanda tangan">
              <input type="checkbox" class="custom-control-input" v-model="ad.required" :id="`required${index}`">
              <label class="custom-control-label" :for="`required${index}`">Wajib Diisi</label>
            </div>
            <div class="custom-control custom-checkbox" title="Jika diceklis, user di pihak ini tidak dapat mengubah data yang telah ditentukan">
              <input type="checkbox" class="custom-control-input" v-model="ad.canBeChanged" :id="`canBeChanged${index}`">
              <label class="custom-control-label" :for="`canBeChanged${index}`">Larang Perubahan</label>
            </div>
          </div>
          <div class="col-md-1">
            <button class="btn btn-danger btn-sm" type="button" @click="deleteAdditionalData(index)"><i class="fa fa-times"></i></button>
          </div>
        </div>
      </div>
      <div class="text-right">
        <button type="button" class="btn btn-warning btn-sm" @click="newAdditionalData()"><i class="fa fa-plus"></i> Tambah Kolom</button>
      </div>
      <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> Perbarui Data</button>
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
      user: {
        name: '',
        data: '',
        id: ''
      },
      menu: [
        {
          name: "Pengaturan Pihak",
          to: {name: "aDocSettingParty"}
        }
      ]
    }
  },
  methods: {
    newAdditionalData() {
      this.user.data.push({name: "", canBeChanged: false, required: false})
    },
    deleteAdditionalData(index) {
      if (index > -1) {
        this.user.data.splice(index, 1)
      }
    },
    updateParty() {
      this.axios.put(`${this.api}/doc_party/${this.user.id}`, {
        name: this.user.name,
        data: this.user.data
      }, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).then(res => {
        if (res.data.status) {
          this.toastr.success("Berhasil memperbarui pihak dokumen!")
          this.$router.push({name: 'aDocSettingParty'})
        }
        else this.toastr.error("Terjadi kesalahan!")
      })
    },
    getUser() {
      this.axios.get(`${this.api}/doc_party/${this.$route.params.id_party}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(res => {
        this.user.name = res.data.res[0].name
        this.user.id = res.data.res[0].id
        this.user.data = JSON.parse(res.data.res[0].data)
      })
    }
  },
  mounted() {
    this.getUser()
  }
}
</script>
