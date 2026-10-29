<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  orientation?: 'horizontal' | 'vertical'
}

const _props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
})

const { isAuthenticated, user, logout } = useAuth()

const userMenuItems = computed(() => [
  [
    {
      label: user.value?.email || 'dev@nodewave.net',
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: 'Dashboard',
      icon: 'i-line-md-grid-3-filled',
      to: '/dashboard',
    },
    // {
    //   label: 'Device Fleet',
    //   icon: 'i-heroicons-cpu-chip-20-solid',
    //   to: '/devices',
    // },
  ],
  [
    {
      label: 'Sign Out',
      icon: 'i-line-md-logout',
      click: logout,
    },
  ],
])
</script>

<template>
  <div
    class="flex items-center gap-2"
    :class="[
      orientation === 'vertical' ? 'w-full flex-col' : 'w-auto flex-row',
    ]"
  >
    <template v-if="!isAuthenticated">
      <!-- Sign In Button -->
      <UButton
        to="/auth/signin"
        color="neutral"
        variant="ghost"
        size="sm"
        class="font-medium transition-colors hover:text-cyan-500"
        :class="{ 'w-full justify-center': orientation === 'vertical' }"
      >
        Sign In
      </UButton>

      <!-- Get Started Primary CTA -->
      <UButton
        to="/auth/signup"
        color="primary"
        variant="solid"
        size="sm"
        trailing-icon="i-heroicons-arrow-right-20-solid"
        class="font-semibold shadow-sm transition-all hover:shadow-cyan-500/25"
        :class="{ 'w-full justify-center': orientation === 'vertical' }"
      >
        Get Started
      </UButton>
    </template>

    <template v-else>
      <!-- Authenticated User Dropdown -->
      <UDropdownMenu
        :items="userMenuItems"
        :content="{ align: orientation === 'vertical' ? 'start' : 'end' }"
        :class="{ 'w-full': orientation === 'vertical' }"
      >
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          icon="i-heroicons-user-circle-20-solid"
          trailing-icon="i-heroicons-chevron-down-20-solid"
          class="font-medium"
          :class="{ 'w-full justify-between': orientation === 'vertical' }"
        >
          {{ user?.name || 'Account' }}
        </UButton>
      </UDropdownMenu>
    </template>
  </div>
</template>
