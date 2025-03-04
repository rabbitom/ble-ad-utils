<template>
  <div class="container">
    <el-input v-model="bytes" placeholder="bytes of BLE advertisements" clearable></el-input>
    <el-table class="flex-1" :data="fields">
      <el-table-column prop="length" label="Length(HEX)" width="120">
        <template #default="scope">
          {{ hexString(scope.row.length) }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Type(HEX)" width="120">
        <template #default="scope">
          {{ hexString(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="value" label="Value(HEX)">
        <template #default="scope">
          {{ hexString(scope.row.bytes) }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Name">
        <template #default="scope">
          {{ adTypeName(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Description">
        <template #default="scope">
          {{ adTypeDescription(scope.row.type, scope.row.bytes) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">Fork me on GitHub: <a href="https://github.com/rabbitom/ble-ad-utils">ble-ad-utils</a></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { hexString, parseHexString, parseRawAdvertisingData } from './lib/utils';
import { adTypeName, adTypeDescription } from './lib/ad-types';
const bytes = ref('');
const fields = computed(() => {
  try {
    const input = bytes.value.replace(/^[^0-9a-fA-F]*/, '');
    const rawData = parseHexString(input);
    return parseRawAdvertisingData(rawData);
  }
  catch(e) {
    return [];
  }
})
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.flex-1 {
  flex: 1;
}
.footer {
  text-align: center;
}
</style>
