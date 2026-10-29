<script setup lang="ts">
useSeoMeta({
  title: 'Secure IoT FOTA Platform',
  ogTitle: 'NODEFOTA - Zero-Trust Wireless Firmware Updates',
  description: 'Enterprise-grade wireless firmware updates, cryptographic differential patching, and dual-bank rollback safety for IoT fleets.',
  ogDescription: 'Enterprise-grade wireless firmware updates, cryptographic differential patching, and dual-bank rollback safety for IoT fleets.',
  ogImage: 'https://secure-iot-fota-platform-beta.vercel.app/og-image.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
