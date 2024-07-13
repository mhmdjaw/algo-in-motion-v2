import {
  type CSSVariablesResolver,
  createTheme,
  rem,
  // type VariantColorsResolver,
  // defaultVariantColorsResolver,
  // parseThemeColor,
  Button,
  Alert,
  Kbd,
  Slider
} from '@mantine/core'
import buttonStyles from './button.module.css'
import kbdStyles from './kbd.module.css'
import sliderStyles from './slider.module.css'

// const variantColorResolver: VariantColorsResolver = (input) => {
//   const defaultResolvedColors = defaultVariantColorsResolver(input)
//   const parsedColor = parseThemeColor({
//     color: input.color || input.theme.primaryColor,
//     theme: input.theme
//   })

//   // Override some properties for button variant
//   if (input.variant === 'outline' && parsedColor.color === 'black') {
//     return {
//       ...defaultResolvedColors,
//       hover: 'var(--mantine-color-text)',
//       hoverColor: 'var(--mantine-color-body)'
//     }
//   }

//   // Completely override variant
//   if (input.variant === 'outline' && parsedColor.color === 'white') {
//     return {
//       background: 'transparent',
//       border: `${rem(1)} solid var(--mantine-color-body)`,
//       color: 'var(--mantine-color-body)',
//       hover: 'var(--mantine-color-body)',
//       hoverColor: 'var(--mantine-color-text)'
//     }
//   }

//   return defaultResolvedColors
// }

const theme = createTheme({
  fontFamily:
    '"Montserrat", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
  headings: {
    fontFamily:
      '"Erica One", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji'
  },
  cursorType: 'pointer',
  activeClassName: '',
  colors: {
    // primary
    pink: [
      '#fef4f3',
      '#fde4e2',
      '#fbd4d0',
      '#fac4be',
      '#f9b4ac',
      '#f7a49b',
      '#f69489',
      '#d17e74',
      '#ac6860',
      '#87514b'
    ],
    // secondary
    blue: [
      '#edf5f8',
      '#d3e6ee',
      '#b8d7e3',
      '#9ec8d9',
      '#83b9ce',
      '#69aac4',
      '#4e9bb9',
      '#42849d',
      '#376d82',
      '#2b5566'
    ]
  },
  autoContrast: true,
  primaryShade: 7,
  luminanceThreshold: 0.3,
  primaryColor: 'pink',
  other: {
    borderWidth: rem(1),
    fontWeights: {
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700'
    },
    headerHeight: rem(75)
  },
  // variantColorResolver,
  components: {
    Button: Button.extend({
      vars: (_theme, props) => {
        if (props.color) {
          return {
            root: {
              '--button-bg': `var(--mantine-color-${props.color}-3)`,
              '--button-hover': `var(--mantine-color-${props.color}-7)`
            }
          }
        }

        return { root: {} }
      },
      classNames: (_theme, props) => {
        if (props.variant === 'retro-primary') {
          return {
            root: buttonStyles.retroPrimaryRoot
          }
        }

        if (props.variant === 'retro-secondary') {
          return {
            root: buttonStyles.retroSecondaryRoot
          }
        }

        return {}
      }
    }),
    Kbd: Kbd.extend({
      classNames: {
        root: kbdStyles.kbdRoot
      }
    }),
    Slider: Slider.extend({
      classNames: {
        label: sliderStyles.label
      }
    }),
    Alert: Alert.extend({
      styles: {
        title: {
          fontSize: rem(16)
        }
      }
    })
  }
})

export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-border-width': theme.other.borderWidth,
    '--mantine-fw-rg': theme.other.fontWeights.regular,
    '--mantine-fw-md': theme.other.fontWeights.medium,
    '--mantine-fw-sb': theme.other.fontWeights.semiBold,
    '--mantine-fw-b': theme.other.fontWeights.bold,
    '--mantine-header-height': theme.other.headerHeight
  },
  light: {},
  dark: {}
})

export default theme
