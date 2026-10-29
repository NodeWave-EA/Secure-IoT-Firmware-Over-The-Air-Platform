<script setup lang="ts">
const CANARY_STAGES = [
  {
    percent: '1%',
    status: 'Canary Group',
    state: 'Passed',
    color: 'text-emerald-500 border-emerald-500/30',
  },
  {
    percent: '10%',
    status: 'Beta Fleet',
    state: 'Active',
    color: 'text-cyan-500 border-cyan-500/30',
  },
  {
    percent: '50%',
    status: 'Production Wave 1',
    state: 'Queued',
    color: 'text-slate-400 border-slate-700',
  },
  {
    percent: '100%',
    status: 'Global Fleet',
    state: 'Queued',
    color: 'text-slate-400 border-slate-700',
  },
]

const TRANSPORTS = [
  { name: 'Cellular (LTE-M / NB-IoT)', delay: 'Low-power chunking', icon: 'i-heroicons-signal-20-solid' },
  { name: 'LoRaWAN & Sub-1GHz', delay: 'Max 512B payload frames', icon: 'i-heroicons-radio-20-solid' },
  { name: 'Wi-Fi & Ethernet', delay: 'High-speed parallel stream', icon: 'i-heroicons-wifi-20-solid' },
  { name: 'BLE Mesh Gateways', delay: 'Multi-hop node relay', icon: 'i-heroicons-device-phone-mobile-20-solid' },
]

const FLEET_METRICS = [
  { label: 'Active Devices', value: '24,810 / 25,000', status: '99.2% Online' },
  { label: 'Battery Health Avg', value: '3.82 V', status: 'Optimal' },
  { label: 'RAM / Heap Free', value: '42.4 KB', status: 'No Leak' },
]

const AUDIT_EVENTS = [
  { action: 'FOTA_CAMPAIGN_STAGED', actor: 'ci-pipeline@nodewave.net', time: '2m ago' },
  { action: 'ECDSA_SIG_VERIFIED', actor: 'Device #ESP32-90A2', time: '45s ago' },
]
</script>

<template>
  <section id="features" class="scroll-mt-20">
    <UContainer>
      <!-- Section Header -->
      <div class="mb-10 max-w-2xl space-y-2 text-left sm:mx-auto sm:text-center">
        <UBadge color="info" variant="subtle" size="xs" class="rounded-xs font-mono">
          Complete OTA Lifecycle
        </UBadge>
        <h2 class="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Everything You Need for Enterprise Firmware Management
        </h2>
        <p class="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
          From binary compilation and phased campaign rollouts to real-time telemetry and compliance audit trails.
        </p>
      </div>

      <div class="border-y border-slate-200/80 text-left dark:border-slate-800/80">
        <div class="grid grid-cols-1 border-b border-slate-200/80 lg:grid-cols-12 dark:border-slate-800/80">
          <div class="flex flex-col justify-between border-b border-slate-200/80 p-6 lg:col-span-8 lg:border-r lg:border-b-0 dark:border-slate-800/80">
            <div>
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-chart-bar-20-solid" class="h-5 w-5 text-cyan-500" />
                  <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Campaign Rollouts
                  </span>
                </div>
                <UBadge color="info" variant="subtle" size="xs" class="rounded-xs font-mono">
                  Auto-Halt Active
                </UBadge>
              </div>

              <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                Staged Canary Releases & Automated Safety Guards
              </h3>
              <p class="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Schedule staged deployments across target device cohorts. Automatically pause campaigns if real-time diagnostics detect spikes in watchdog resets, memory leak signatures, or failed boot swaps.
              </p>
            </div>

            <div class="mt-6 border-t border-slate-200/50 pt-4 dark:border-slate-800/50">
              <div class="grid grid-cols-2 gap-2 font-mono text-[11px] sm:grid-cols-4">
                <div
                  v-for="stage in CANARY_STAGES"
                  :key="stage.percent"
                  class="rounded-xs border p-2 dark:bg-slate-950/40"
                  :class="stage.color"
                >
                  <div class="mb-0.5 flex items-center justify-between font-bold">
                    <span>{{ stage.percent }}</span>
                    <span class="rounded-xs bg-slate-800/20 px-1 text-[9px] uppercase dark:bg-slate-800/60">
                      {{ stage.state }}
                    </span>
                  </div>
                  <span class="block truncate text-[10px] text-slate-500 dark:text-slate-400">
                    {{ stage.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col justify-between p-6 lg:col-span-4">
            <div>
              <div class="mb-3 flex items-center gap-2">
                <UIcon name="i-heroicons-key-20-solid" class="h-5 w-5 text-cyan-500" />
                <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Hardware Security
                </span>
              </div>

              <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                HSM & Secure Element Native Support
              </h3>
              <p class="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Offload ECDSA-P256 public key validation directly to dedicated silicon to prevent private key extraction via physical bus probing.
              </p>
            </div>

            <div class="mt-6 flex flex-wrap gap-2 border-t border-slate-200/50 pt-4 font-mono text-[10px] text-slate-600 dark:border-slate-800/50 dark:text-slate-400">
              <span class="rounded-xs border border-slate-200 px-2 py-1 dark:border-slate-800">ATECC608A</span>
              <span class="rounded-xs border border-slate-200 px-2 py-1 dark:border-slate-800">NXP SE050</span>
              <span class="rounded-xs border border-slate-200 px-2 py-1 dark:border-slate-800">STSAFE-A110</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 border-b border-slate-200/80 lg:grid-cols-12 dark:border-slate-800/80">
          <div class="flex flex-col justify-between border-b border-slate-200/80 p-6 lg:col-span-5 lg:border-r lg:border-b-0 dark:border-slate-800/80">
            <div>
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-squares-2x2-20-solid" class="h-5 w-5 text-cyan-500" />
                  <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Fleet Telemetry
                  </span>
                </div>
                <UBadge color="info" variant="subtle" size="xs" class="rounded-xs font-mono">
                  Live Sync
                </UBadge>
              </div>

              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                Real-Time Fleet Status Tracking & Analytics
              </h3>
              <p class="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Monitor thousands of active microcontrollers in real time. Collect key health metrics including battery voltages, signal RSSI, memory heaps, and firmware version distribution.
              </p>
            </div>

            <div class="mt-5 space-y-2 border-t border-slate-200/50 pt-3 font-mono text-[11px] dark:border-slate-800/50">
              <div v-for="metric in FLEET_METRICS" :key="metric.label" class="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span class="text-slate-800 dark:text-slate-200">{{ metric.label }}:</span>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-cyan-600 dark:text-cyan-400">{{ metric.value }}</span>
                  <span class="text-[9px] text-emerald-500">({{ metric.status }})</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col justify-between p-6 lg:col-span-7">
            <div>
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-cpu-chip-20-solid" class="h-5 w-5 text-cyan-500" />
                  <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Delta Engine
                  </span>
                </div>
                <UBadge color="info" variant="subtle" size="xs" class="rounded-xs font-mono">
                  Avg -92.4% Patch Size
                </UBadge>
              </div>

              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                Byte-Level VCDIFF / BSDIFF Patch Compiler
              </h3>
              <p class="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Tuned specifically for MCU binary layouts, NodeFOTA generates minimal byte diffs by recognizing code relocation patterns, reducing a 1MB build payload down to ~30KB over cellular.
              </p>
            </div>

            <div class="mt-5 flex items-center justify-between border-t border-slate-200/50 pt-3 font-mono text-[11px] text-slate-500 dark:border-slate-800/50 dark:text-slate-400">
              <span>Diff Compression: VCDIFF-LZMA2</span>
              <span class="font-semibold text-cyan-600 dark:text-cyan-400">32.8 KB Patch vs 1,024 KB Full Image</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 border-b border-slate-200/80 lg:grid-cols-12 dark:border-slate-800/80">
          <div class="flex flex-col justify-between border-b border-slate-200/80 p-6 lg:col-span-7 lg:border-r lg:border-b-0 dark:border-slate-800/80">
            <div>
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-arrow-path-rounded-square-20-solid" class="h-5 w-5 text-cyan-500" />
                  <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Fail-Safe Bootloader
                  </span>
                </div>
                <UBadge color="neutral" variant="subtle" size="xs" class="rounded-xs font-mono">
                  Hardware Flash Swap
                </UBadge>
              </div>

              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                Atomic Partition Swapping & Automatic Rollback
              </h3>
              <p class="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Firmware writes directly to inactive Bank B while Bank A executes uninterrupted. The bootloader swaps active partitions only after signature validation passes, automatically reverting if post-boot watchdog checks time out.
              </p>
            </div>

            <div class="mt-5 flex items-center justify-between border-t border-slate-200/50 pt-3 font-mono text-[11px] text-slate-500 dark:border-slate-800/50 dark:text-slate-400">
              <span class="font-semibold text-slate-700 dark:text-slate-300">Boot Watchdog Guard:</span>
              <span class="font-bold text-cyan-600 dark:text-cyan-400">15,000 ms (Dual-Bank A/B Active)</span>
            </div>
          </div>

          <div class="flex flex-col justify-between p-6 lg:col-span-5">
            <div>
              <div class="mb-3 flex items-center gap-2">
                <UIcon name="i-heroicons-signal-20-solid" class="h-5 w-5 text-cyan-500" />
                <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Transport Agnostic
                </span>
              </div>

              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                Bandwidth-Throttled Network Streaming
              </h3>
              <p class="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Configurable packet chunking and resume mechanisms optimized for low-duty-cycle, high-latency, or intermittent networks.
              </p>
            </div>

            <div class="mt-5 space-y-2 border-t border-slate-200/50 pt-3 font-mono text-[11px] dark:border-slate-800/50">
              <div v-for="transport in TRANSPORTS" :key="transport.name" class="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <div class="flex items-center gap-1.5">
                  <UIcon :name="transport.icon" class="h-3.5 w-3.5 text-cyan-500" />
                  <span class="text-slate-800 dark:text-slate-200">{{ transport.name }}</span>
                </div>
                <span class="text-[10px] text-slate-500">{{ transport.delay }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12">
          <div class="flex flex-col justify-between border-b border-slate-200/80 p-6 lg:col-span-4 lg:border-r lg:border-b-0 dark:border-slate-800/80">
            <div>
              <div class="mb-3 flex items-center gap-2">
                <UIcon name="i-heroicons-key-20-solid" class="h-5 w-5 text-cyan-500" />
                <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Access Control
                </span>
              </div>

              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                Scoped API Keys & Role Permissions
              </h3>
              <p class="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Secure device-to-cloud and CI/CD automation channels using granularly scoped API tokens with mandatory write-level scope validation.
              </p>
            </div>

            <div class="mt-4 flex flex-wrap gap-1.5 border-t border-slate-200/50 pt-3 font-mono text-[10px] text-slate-600 dark:border-slate-800/50 dark:text-slate-400">
              <span class="rounded-xs border border-slate-200 px-1.5 py-0.5 dark:border-slate-800">fota:deploy</span>
              <span class="rounded-xs border border-slate-200 px-1.5 py-0.5 dark:border-slate-800">device:read</span>
              <span class="rounded-xs border border-slate-200 px-1.5 py-0.5 dark:border-slate-800">telemetry:write</span>
            </div>
          </div>

          <div class="flex flex-col justify-between border-b border-slate-200/80 p-6 lg:col-span-4 lg:border-r lg:border-b-0 dark:border-slate-800/80">
            <div>
              <div class="mb-3 flex items-center gap-2">
                <UIcon name="i-heroicons-lock-closed-20-solid" class="h-5 w-5 text-cyan-500" />
                <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Transport Encryption
                </span>
              </div>

              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                mTLS 1.3 & Per-Device Session Keys
              </h3>
              <p class="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Mutual TLS authentication with individual device certificates prevents MITM attacks and spoofed binary payload injections across all edges.
              </p>
            </div>

            <div class="mt-4 flex items-center justify-between border-t border-slate-200/50 pt-3 font-mono text-[11px] text-slate-500 dark:border-slate-800/50 dark:text-slate-400">
              <span>TLS_AES_128_GCM_SHA256</span>
              <span class="font-semibold text-emerald-500">[mTLS ACTIVE]</span>
            </div>
          </div>

          <div class="flex flex-col justify-between p-6 lg:col-span-4">
            <div>
              <div class="mb-3 flex items-center gap-2">
                <UIcon name="i-heroicons-document-text-20-solid" class="h-5 w-5 text-cyan-500" />
                <span class="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Compliance
                </span>
              </div>

              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                Immutable Operational Audit Trail
              </h3>
              <p class="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Comprehensive audit logging for regulatory compliance (SOC 2, ISO 27001), tracking deployment triggers, signature validations, and operator actions.
              </p>
            </div>

            <div class="mt-4 space-y-1.5 border-t border-slate-200/50 pt-3 font-mono text-[10px] dark:border-slate-800/50">
              <div v-for="event in AUDIT_EVENTS" :key="event.action" class="flex justify-between text-slate-500 dark:text-slate-400">
                <span class="truncate text-cyan-600 dark:text-cyan-400">{{ event.action }}</span>
                <span class="shrink-0 text-slate-400">{{ event.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
