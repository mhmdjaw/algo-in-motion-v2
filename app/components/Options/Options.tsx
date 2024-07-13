import { Slider, Stack, Text } from '@mantine/core'
import styles from './Options.module.css'

export function Options() {
  return (
    <div className={styles.container}>
      <Stack className={styles.optionContainer}>
        <Text className={styles.label}>Speed</Text>
        <Slider w="100%" />
      </Stack>
      <Stack className={styles.optionContainer}>
        <Text className={styles.label}>Edges</Text>
        <Slider disabled w="100%" />
      </Stack>
      <Stack className={styles.optionContainer}>
        <Text className={styles.label}>Cities</Text>
        <Slider w="100%" />
      </Stack>
    </div>
  )
}
