import type { ButtonProps, NavigationMenuItem } from '@nuxt/ui'

import type { NuxtLinkProps } from '#app'

export const MAIN_NAVIGATION = ref<NavigationMenuItem[]>([
  {
    label: 'Home',
    icon: 'i-line-md-home-simple-twotone',
    to: '/',
  },
  {
    label: 'Docs',
    icon: 'i-tabler-book-filled',
    to: '/docs',
  },
  {
    label: 'Blog',
    icon: 'i-line-md-text-box-multiple-twotone',
    to: '/blog',
  },
  {
    label: 'Support',
    icon: 'i-tabler-lifebuoy',
    to: '/support',
  },
])

export const COMPANY = ref<NuxtLinkProps>({
  to: 'https://nodewave.net',
  rel: 'noopener noreferrer',
  external: true,
  target: '_blank',
})

export const GITHUB_REPO = ref<ButtonProps>({
  to: 'https://github.com/nodewave-ea',
  rel: 'noopener noreferrer',
  icon: 'i-line-md-github-twotone-loop',
  external: true,
  target: '_blank',
})
