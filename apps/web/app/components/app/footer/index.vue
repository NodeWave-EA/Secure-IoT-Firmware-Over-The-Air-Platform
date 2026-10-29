<script setup lang="ts">
import { ref } from 'vue'

import { COMPANY, GITHUB_REPO } from '~/utils/navigation'

const email = ref('')
const isSubscribed = ref(false)

function handleSubscribe() {
  if (email.value) {
    isSubscribed.value = true
    email.value = ''
  }
}

const PLATFORM_LINKS = [
  { label: 'Differential Delta Engine', to: '/#features', icon: 'i-heroicons-bolt-20-solid' },
  { label: 'Zero-Trust Architecture', to: '/#architecture', icon: 'i-heroicons-shield-check-20-solid' },
  { label: 'Supported Hardware & MCUs', to: '/#supported-chips', icon: 'i-heroicons-cpu-chip-20-solid' },
  { label: 'Interactive FOTA Simulator', to: '/#simulator', icon: 'i-heroicons-play-circle-20-solid' },
]

const RESOURCE_LINKS = [
  { label: 'Documentation Portal', to: '/docs' },
  { label: 'Zephyr OS Module', href: 'https://github.com/nodewave/zephyr-fota', target: '_blank' },
  { label: 'FreeRTOS Client SDK', href: 'https://github.com/nodewave/freertos-fota', target: '_blank' },
  { label: 'REST API Reference', to: '/docs/api' },
]

const COMPANY_LINKS = [
  { label: 'Engineering Blog', to: '/blog' },
  { label: 'Help & Support', to: '/support' },
  { label: 'About NodeWave', ...COMPANY },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
]
</script>

<template>
  <footer class="border-t border-slate-200/80 bg-slate-100/60 transition-colors dark:border-slate-800/80 dark:bg-[#05080F]">
    <UContainer class="py-10 md:py-14">
      <div class="border-y border-slate-200/80 text-left dark:border-slate-800/80">
        <div class="grid grid-cols-1 border-b border-slate-200/80 lg:grid-cols-12 dark:border-slate-800/80">
          <div class="flex flex-col justify-between border-b border-slate-200/80 p-6 lg:col-span-6 lg:border-r lg:border-b-0 dark:border-slate-800/80">
            <div class="space-y-3">
              <NuxtLink to="/" class="flex items-center gap-3">
                <AppLogo :size="36" />
                <div class="flex flex-col">
                  <span class="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Node<span class="text-cyan-500">FOTA</span>
                  </span>
                  <span class="-mt-1 font-mono text-[10px] tracking-wider text-slate-500 dark:text-slate-400">
                    by <NuxtLink v-bind="COMPANY" class="underline decoration-slate-400 hover:text-cyan-400">nodewave.net</NuxtLink>
                  </span>
                </div>
              </NuxtLink>

              <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Next-generation zero-trust Over-The-Air firmware management platform for embedded microcontrollers, edge gateways, and IoT device fleets.
              </p>
            </div>

            <div class="mt-6 flex items-center justify-between border-t border-slate-200/50 pt-3 dark:border-slate-800/50">
              <div class="flex items-center gap-2">
                <span class="relative flex h-2 w-2">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span class="font-mono text-xs text-slate-700 dark:text-slate-300">
                  All systems operational
                </span>
              </div>
              <NuxtLink
                to="/status"
                class="font-mono text-[11px] text-cyan-600 underline decoration-cyan-500/40 hover:text-cyan-500 dark:text-cyan-400"
              >
                System Health →
              </NuxtLink>
            </div>
          </div>

          <div class="flex flex-col justify-between p-6 lg:col-span-6">
            <div>
              <div class="mb-2 flex items-center justify-between">
                <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Security & SDK Bulletins
                </span>
                <UBadge color="info" variant="subtle" size="xs" class="rounded-xs font-mono">
                  Updates
                </UBadge>
              </div>

              <h4 class="text-sm font-bold text-slate-900 dark:text-white">
                Stay ahead of firmware vulnerabilities
              </h4>
              <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Get technical alerts for C/C++ client SDK releases, Zephyr OS modules, and delta patch optimization guides.
              </p>
            </div>

            <!-- Subscribe Form -->
            <form v-if="!isSubscribed" class="mt-4 flex flex-col gap-2 sm:flex-row" @submit.prevent="handleSubscribe">
              <UInput
                v-model="email"
                type="email"
                placeholder="engineer@company.com"
                icon="i-heroicons-envelope-20-solid"
                required
                color="neutral"
                size="sm"
                class="flex-1 rounded-xs"
              />
              <UButton
                type="submit"
                color="primary"
                variant="solid"
                size="sm"
                class="shrink-0 justify-center rounded-xs font-semibold"
              >
                Subscribe
              </UButton>
            </form>

            <div v-else class="mt-4 border-t border-slate-200/50 pt-3 font-mono text-xs text-emerald-600 dark:border-slate-800/50 dark:text-emerald-400">
              ✓ Subscribed to NodeFOTA engineering bulletins.
            </div>
          </div>
        </div>

        <!-- Bottom Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12">
          <div class="flex flex-col justify-between border-b border-slate-200/80 p-6 md:border-r md:border-b-0 lg:col-span-4 dark:border-slate-800/80">
            <h4 class="mb-3 font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Platform
            </h4>
            <ul class="space-y-2.5 text-xs">
              <li v-for="item in PLATFORM_LINKS" :key="item.label">
                <NuxtLink
                  :to="item.to"
                  class="flex items-center gap-2 text-slate-700 transition-colors hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
                >
                  <UIcon :name="item.icon" class="h-4 w-4 shrink-0 text-cyan-500" />
                  <span>{{ item.label }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="flex flex-col justify-between border-b border-slate-200/80 p-6 md:border-r md:border-b-0 lg:col-span-4 dark:border-slate-800/80">
            <h4 class="mb-3 font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Developer Docs
            </h4>
            <ul class="space-y-2.5 text-xs">
              <li v-for="item in RESOURCE_LINKS" :key="item.label">
                <NuxtLink
                  v-if="item.to"
                  :to="item.to"
                  class="text-slate-700 transition-colors hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
                >
                  {{ item.label }}
                </NuxtLink>
                <a
                  v-else
                  :href="item.href"
                  :target="item.target || '_self'"
                  class="flex items-center justify-between text-slate-700 transition-colors hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
                >
                  <span>{{ item.label }}</span>
                  <UIcon name="i-heroicons-arrow-up-right-20-solid" class="h-3.5 w-3.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          <div class="flex flex-col justify-between p-6 lg:col-span-4">
            <h4 class="mb-3 font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Company
            </h4>
            <ul class="space-y-2.5 text-xs">
              <li v-for="item in COMPANY_LINKS" :key="item.label">
                <NuxtLink
                  v-if="item.to"
                  :to="item.to"
                  class="text-slate-700 transition-colors hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
                >
                  {{ item.label }}
                </NuxtLink>
                <NuxtLink
                  v-else
                  v-bind="item"
                  class="text-slate-700 transition-colors hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 flex flex-col items-center justify-between gap-4 pt-6 text-xs text-slate-500 sm:flex-row dark:text-slate-400">
        <p class="text-center text-xs leading-normal text-slate-500 sm:text-left dark:text-slate-400">
          © {{ new Date().getFullYear() }} NodeFOTA. A
          <NuxtLink v-bind="COMPANY" class="font-medium underline decoration-slate-400 hover:text-cyan-500">
            NodeWave
          </NuxtLink>
          product. All rights reserved.
        </p>

        <div class="flex shrink-0 items-center gap-3">
          <UTooltip text="Open GitHub Repository">
            <UButton
              v-bind="GITHUB_REPO"
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-simple-icons-github"
              aria-label="GitHub Repository"
              class="rounded-xs"
            />
          </UTooltip>

          <UTooltip text="Visit NodeWave Website">
            <UButton
              v-bind="COMPANY"
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-heroicons-globe-alt-20-solid"
              aria-label="NodeWave Website"
              class="rounded-xs"
            />
          </UTooltip>

          <UBadge color="neutral" variant="subtle" size="xs" class="rounded-xs font-mono text-[10px]">
            Nuxt 4 + Nuxt UI v3
          </UBadge>
        </div>
      </div>
    </UContainer>
  </footer>
</template>
