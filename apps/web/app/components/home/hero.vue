<script setup lang="ts">
import { useAuth } from '~/composables/use-auth'
import { GITHUB_REPO } from '~/utils/navigation'

const { isAuthenticated, primaryAction } = useAuth()
</script>

<template>
  <section class="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24">
    <!-- Background Ambient Glow -->
    <div
      class="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-80 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px] dark:bg-cyan-500/15"
      aria-hidden="true"
    />

    <UContainer>
      <div class="mx-auto max-w-5xl text-left sm:text-center">
        <div class="inline-flex items-center gap-2 rounded-xs border border-slate-200 bg-white/50 px-3 py-1.5 text-xs font-medium text-slate-700 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
          <UBadge color="info" variant="subtle" size="xs" class="rounded-xs font-bold">
            v1.0 Release
          </UBadge>
          <span>OTA Firmware Updates Made Easy</span>
        </div>

        <h1 class="mt-6 text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
          Reliable, bandwidth-efficient
          <span class="bg-linear-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            FOTA updates for embedded fleets
          </span>
        </h1>

        <p class="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:mx-auto sm:text-lg dark:text-slate-300">
          Deliver signed firmware patches over Cellular, LoRaWAN, and Wi-Fi. Minimize data consumption with binary diffing and eliminate field bricking using dual-bank boot verification.
        </p>

        <div class="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <UButton
            :to="primaryAction.to"
            color="primary"
            variant="solid"
            size="lg"
            :icon="primaryAction.icon"
            class="justify-center rounded-xs font-bold shadow-md shadow-cyan-500/20"
          >
            {{ isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial' }}
          </UButton>

          <UButton
            to="#simulator"
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-heroicons-play-circle-20-solid"
            class="justify-center rounded-xs font-semibold"
          >
            Try Live Simulator
          </UButton>

          <UButton
            v-bind="GITHUB_REPO"
            color="neutral"
            variant="ghost"
            size="lg"
            icon="i-simple-icons-github"
            aria-label="GitHub Repository"
            class="justify-center rounded-xs font-medium"
          >
            View Source
          </UButton>
        </div>

        <div class="mt-12 border-y border-slate-200/80 text-left sm:mt-16 dark:border-slate-800/80">
          <div class="grid grid-cols-1 border-b border-slate-200/80 lg:grid-cols-12 dark:border-slate-800/80">
            <div class="flex flex-col justify-between border-slate-200/80 p-6 lg:col-span-7 lg:border-r dark:border-slate-800/80">
              <div>
                <div class="mb-3 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-bolt-20-solid" class="h-5 w-5 text-cyan-500" />
                    <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">Differential Delta Engine</span>
                  </div>
                  <UBadge color="info" variant="subtle" size="xs" class="rounded-xs font-mono">
                    Up to 95% Saved
                  </UBadge>
                </div>

                <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                  Binary Diffing for Low-Bandwidth Networks
                </h3>
                <p class="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Instead of streaming full 1MB+ firmware binaries over costly cellular or LoRaWAN links, NodeFOTA generates byte-level differential patches as small as 30KB.
                </p>
              </div>

              <!-- Inline Comparison Lines -->
              <div class="mt-6 border-t border-slate-200/50 pt-4 font-mono text-xs dark:border-slate-800/50">
                <div class="mb-1 flex items-center justify-between text-[11px]">
                  <span class="text-slate-500 dark:text-slate-400">Full Firmware (v1.0.0)</span>
                  <span class="text-slate-700 dark:text-slate-300">1,024 KB</span>
                </div>
                <div class="mb-2.5 h-1.5 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <div class="h-full w-full bg-slate-400 dark:bg-slate-600" />
                </div>

                <div class="mb-1 flex items-center justify-between text-[11px]">
                  <span class="font-semibold text-cyan-600 dark:text-cyan-400">NodeFOTA Delta Patch (v1.0.1)</span>
                  <span class="font-bold text-emerald-500">32.8 KB (-96.8%)</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <div class="h-full w-[3.2%] bg-linear-to-r from-cyan-500 to-emerald-400" />
                </div>
              </div>
            </div>

            <div class="flex flex-col justify-between border-b border-slate-200/80 p-6 lg:col-span-5 lg:border-b-0 dark:border-slate-800/80">
              <div>
                <div class="mb-3 flex items-center gap-2">
                  <UIcon name="i-heroicons-arrow-path-20-solid" class="h-5 w-5 text-cyan-500" />
                  <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">Dual-Bank A/B Layout</span>
                </div>

                <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                  Zero Field Bricking
                </h3>
                <p class="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Incoming updates write strictly to secondary Bank B while Bank A runs uninterrupted. Automatic rollback triggers if post-update boot watchdog checks fail.
                </p>
              </div>

              <div class="mt-6 grid grid-cols-2 divide-x divide-slate-200/80 border-t border-slate-200/50 pt-4 font-mono text-[11px] dark:divide-slate-800/80 dark:border-slate-800/50">
                <div class="pr-3">
                  <span class="mb-0.5 block font-bold text-emerald-600 dark:text-emerald-400">BANK A [ACTIVE]</span>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400">v1.0.0 (Executing)</span>
                </div>
                <div class="pl-3">
                  <span class="mb-0.5 block font-bold text-cyan-600 dark:text-cyan-400">BANK B [STAGING]</span>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400">v1.0.1 (Verified)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Row -->
          <div class="grid grid-cols-1 lg:grid-cols-12">
            <div class="flex flex-col justify-between border-b border-slate-200/80 p-6 lg:col-span-6 lg:border-r lg:border-b-0 dark:border-slate-800/80">
              <div>
                <div class="mb-3 flex items-center gap-2">
                  <UIcon name="i-heroicons-shield-check-20-solid" class="h-5 w-5 text-cyan-500" />
                  <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">Zero-Trust Security</span>
                </div>

                <h3 class="text-base font-bold text-slate-900 dark:text-white">
                  ECDSA-P256 Signature Verification
                </h3>
                <p class="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Every binary is cryptographically signed at build time. On-device Hardware Root of Trust or HSM validates signature and CRC-32 checksums before execution.
                </p>
              </div>

              <div class="mt-4 flex items-center justify-between border-t border-slate-200/50 pt-3 font-mono text-[11px] text-slate-500 dark:border-slate-800/50 dark:text-slate-400">
                <span class="truncate">SHA256: e3b0c44298fc1c149afbf4...</span>
                <span class="ml-2 shrink-0 font-semibold text-emerald-500">[PASSED]</span>
              </div>
            </div>

            <div class="flex flex-col justify-between p-6 lg:col-span-6">
              <div>
                <div class="mb-3 flex items-center gap-2">
                  <UIcon name="i-heroicons-cpu-chip-20-solid" class="h-5 w-5 text-cyan-500" />
                  <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">Silicon Support</span>
                </div>

                <h3 class="text-base font-bold text-slate-900 dark:text-white">
                  Native Zephyr OS & FreeRTOS Modules
                </h3>
                <p class="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Production-ready C/C++ client modules with low RAM footprint (&lt; 8 KB) designed for Espressif ESP32, STMicroelectronics STM32, and Nordic Semiconductor MCUs.
                </p>
              </div>

              <div class="mt-4 flex flex-wrap gap-3 border-t border-slate-200/50 pt-3 font-mono text-[10px] text-slate-500 dark:border-slate-800/50 dark:text-slate-400">
                <span>ESP32-S3</span>
                <span>•</span>
                <span>STM32H7</span>
                <span>•</span>
                <span>nRF9160</span>
                <span>•</span>
                <span>RP2040</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
