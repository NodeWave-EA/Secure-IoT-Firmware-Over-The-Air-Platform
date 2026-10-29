<script setup lang="ts">
import { computed } from 'vue'

import { useTheme } from '~/composables/use-theme'

const { currentTheme, themeIcon } = useTheme()

const items = computed(() => [
  [
    {
      label: 'System',
      icon: 'i-line-md-monitor-twotone',
      type: 'checkbox' as const,
      checked: currentTheme.value === 'system',
      onSelect: () => { currentTheme.value = 'system' },
      click: () => { currentTheme.value = 'system' },
    },
    {
      label: 'Light',
      icon: 'i-line-md-sun-rising-filled-loop',
      type: 'checkbox' as const,
      checked: currentTheme.value === 'light',
      onSelect: () => { currentTheme.value = 'light' },
      click: () => { currentTheme.value = 'light' },
    },
    {
      label: 'Dark',
      icon: 'i-line-md-moon-rising-filled-loop',
      type: 'checkbox' as const,
      checked: currentTheme.value === 'dark',
      onSelect: () => { currentTheme.value = 'dark' },
      click: () => { currentTheme.value = 'dark' },
    },
  ],
])
</script>

<template>
  <UTooltip text="Toggle Theme" :shortcuts="['ctrl', 'shift', 't']">
    <UDropdownMenu :items="items">
      <ClientOnly>
        <UButton
          :icon="themeIcon"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Switch Theme Mode"
          class="relative"
        />
        <template #fallback>
          <UButton
            icon="i-line-md-monitor-twotone"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Switch Theme Mode"
            class="relative"
          />
        </template>
      </ClientOnly>
    </UDropdownMenu>
  </UTooltip>
</template>
