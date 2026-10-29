<script setup lang="ts">
</script>

<template>
  <UHeader mode="drawer">
    <!-- Branding -->
    <template #left>
      <NuxtLink
        to="/"
        class="group flex items-center gap-3 rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
      >
        <AppLogo :size="40" />
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5">
            <span class="text-lg font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-cyan-500 dark:text-white dark:group-hover:text-cyan-400">
              Node<span class="text-cyan-500">FOTA</span>
            </span>
            <UBadge color="info" variant="subtle" size="xs" class="px-1 py-0 font-mono text-[9px]">v1.0.0</UBadge>
          </div>
          <span class="-mt-1 font-mono text-[10px] tracking-wider text-slate-500 dark:text-slate-400">
            by <NuxtLink
              v-bind="COMPANY"
              class="underline decoration-slate-400 hover:text-cyan-400"
              @click.stop
            >nodewave.net
            </NuxtLink>
          </span>
        </div>
      </NuxtLink>
    </template>

    <!-- Desktop Navigation -->
    <template #default>
      <UNavigationMenu
        :items="MAIN_NAVIGATION"
        variant="pill"
      />
    </template>

    <!-- Actions -->
    <template #right>
      <AppHeaderThemeToggle />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          v-bind="GITHUB_REPO"
          aria-label="GitHub"
        />
      </UTooltip>

      <!-- Desktop Auth Buttons -->
      <AppHeaderAuthButtons class="hidden md:flex" />
    </template>

    <!-- Mobile Navigation -->
    <template #body>
      <div class="flex h-full flex-col justify-between space-y-6">
        <UNavigationMenu
          :items="MAIN_NAVIGATION"
          orientation="vertical"
          variant="pill"
        />

        <div class="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <!-- Mobile Auth Buttons -->
          <AppHeaderAuthButtons />

          <div class="pt-2 text-center">
            <NuxtLink
              v-bind="COMPANY"
              class="text-[11px] text-slate-500 transition-colors hover:text-cyan-500"
            >
              A NodeWave Product
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </UHeader>
</template>
