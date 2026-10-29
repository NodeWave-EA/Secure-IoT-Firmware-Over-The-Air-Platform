<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-[#070A12] dark:text-slate-100">
    <AppHeader />
    <UMain id="main-content" class="flex-1 focus:outline-none">
      <slot />
    </UMain>
    <AppFooter />
  </div>
</template>
