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
          {{ scope.row.type === 0x09 ? utf8String(scope.row.bytes) : ''}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { hexString, parseHexString, parseRawAdvertisingData, utf8String } from './lib/utils';
import { adTypeName } from './lib/ad-types';
const bytes = ref('');
const fields = computed(() => {
  const rawData = parseHexString(bytes.value);
  return parseRawAdvertisingData(rawData);
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
</style>
