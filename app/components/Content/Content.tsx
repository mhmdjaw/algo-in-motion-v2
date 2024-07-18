import { Title } from '@mantine/core'
import type { PropsWithChildren } from 'react'
import styles from './Content.module.css'

interface ContentProps extends PropsWithChildren {
  title: string
}

export function Content({ title, children }: ContentProps) {
  return (
    <div className={styles.contentContainer}>
      <Title className={styles.title}>{title}</Title>
      {children}
    </div>
  )
}
