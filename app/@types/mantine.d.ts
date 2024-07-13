import '@mantine/core'

declare module '@mantine/core' {
  export interface ButtonProps {
    variant: 'retro-primary' | 'retro-secondary'
  }
}
