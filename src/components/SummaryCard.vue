<script setup>
defineProps({
  title: String,
  value: Number,
  percent: { type: Number, default: 0 },
  note: String,
  color: { type: String, default: "bg-green-500" },
});
</script>

<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {{ title }}
    </p>
    <h2 class="mt-3 text-4xl font-bold text-slate-900">{{ value }}</h2>

    <div class="mt-3 h-1.5 w-full rounded-full bg-slate-100">
      <div
        class="h-1.5 rounded-full"
        :class="color"
        :style="{ width: percent + '%' }"
      ></div>
    </div>

    <p class="mt-2 text-xs text-slate-400">{{ note }}</p>
  </div>
</template>
  