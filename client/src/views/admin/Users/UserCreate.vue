<template>
  <div>
    <form method="post">
      <div class="mb-4">
        <h5>Akun</h5>
        <hr>
        <input type="text" v-model="user.username" autocomplete="off" class="form-control mb-1" ref="username" placeholder="username">
        <input type="text" v-model="user.password" autocomplete="off" ref="password" class="form-control" placeholder="password">
      </div>
      <div class="mb-2">
        <h5>Data</h5>
        <hr>
        <div v-for="(ad, index) in user.additionalData" :key="index" class="row mb-3">
          <div class="col">
            <input type="text" autocomplete="off" v-model="ad.name" class="form-control" placeholder="nama data">
          </div>
          <div class="col">
            <input type="text" autocomplete="off" v-model="ad.value" class="form-control" placeholder="isi data">
          </div>
          <div class="col-md-2">
            <div class="custom-control custom-checkbox" title="Jika diceklis, user ini harus mengisi data ini sebelum tanda tangan">
              <input type="checkbox" class="custom-control-input" v-model="ad.required" :id="`required${index}`">
              <label class="custom-control-label" :for="`required${index}`">Wajib Diisi</label>
            </div>
            <div class="custom-control custom-checkbox" title="Jika diceklis, user ini tidak dapat mengubah data ini">
              <input type="checkbox" class="custom-control-input" v-model="ad.canBeChanged" :id="`canBeChanged${index}`">
              <label class="custom-control-label" :for="`canBeChanged${index}`">Bisa Diubah</label>
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
      <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> Simpan Data</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
        additionalData: [
          {
            name: "asd",
            value: "dsa",
            required: false,
            canBeChanged: false
          },
          {
            name: "",
            value: "",
            required: false,
            canBeChanged: true
          },
          {
            name: "ss",
            value: "ss",
            required: true,
            canBeChanged: false
          }
        ]
      }
    }
  },
  methods: {
    newAdditionalData() {
      this.user.additionalData.push({name: "", value: "", required: false})
    },
    deleteAdditionalData(index) {
      if (index > -1) {
        this.user.additionalData.splice(index, 1)
      }
    }
  }
}
</script>
