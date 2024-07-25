import { Carousel } from '@mantine/carousel'
import { Button, FocusTrap, Modal, Text, useMantineTheme } from '@mantine/core'
import styles from './Tutorial.module.css'
import { useDisclosure, useMediaQuery } from '@mhmdjawhar/react-hooks'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { useCallback } from 'react'
import { Logo } from '~/assets/svg'

export function Tutorial() {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`)

  const [opened, { close }] = useDisclosure((localStorage.getItem('tutorial') ?? 'open') === 'open')

  const onClose = useCallback(() => {
    localStorage.setItem('tutorial', 'closed')
    close()
  }, [close])

  return (
    <Modal
      opened={opened}
      size="xl"
      withCloseButton={false}
      padding={0}
      onClose={onClose}
      classNames={{
        content: styles.modalContent,
        body: styles.modalBody,
        inner: styles.modalInner
      }}
      closeOnClickOutside={false}
      centered
      lockScroll={false}
      fullScreen={isMobile}
    >
      <FocusTrap.InitialFocus />
      <Carousel
        controlsOffset={0}
        classNames={{
          root: styles.carouselRoot,
          viewport: styles.carouselViewport,
          container: styles.carouselContainer,
          controls: styles.carouselControls,
          indicators: styles.carouselIndicators,
          control: styles.carouselControl,
          slide: styles.carouselSlide
        }}
        controlSize={50}
        previousControlIcon={<FaChevronLeft size={20} />}
        nextControlIcon={<FaChevronRight size={20} />}
        withIndicators
      >
        <CarouselSlides />
      </Carousel>
      <div className={styles.buttonContainer}>
        <Button variant="retro-secondary" size="sm" onClick={onClose}>
          Close Tutorial
        </Button>
      </div>
    </Modal>
  )
}

function CarouselSlides() {
  return carouselSlides.map((slide) => (
    <Carousel.Slide key={slide.id}>
      <div className={styles.slideMedia}>{slide.media}</div>
      <div className={styles.slideContent}>
        <Text className={styles.slideTitle}>{slide.title}</Text>
        <Text>{slide.text}</Text>
      </div>
    </Carousel.Slide>
  ))
}

const carouselSlides: {
  id: string
  media: React.ReactNode
  title: string
  text: string
}[] = [
  {
    id: '1',
    media: <Logo width="100%" height="100%" />,
    title: 'Welcome!',
    text: 'Feel free to skip the tutorial by clicking the button below.'
  },
  {
    id: '2',
    media: (
      <video autoPlay loop muted playsInline>
        <source src="/algorithm-dropdown.mp4" type="video/mp4" />
      </video>
    ),
    title: 'Algorithms',
    text: 'Choose an algorithm from the dropwdown menu.'
  },
  {
    id: '3',
    media: (
      <video autoPlay loop muted playsInline>
        <source src="/action-buttons.mp4" type="video/mp4" />
      </video>
    ),
    title: 'Visualizing',
    text: 'Use the action buttons to run the visualization, pause it, or reset it.'
  },
  {
    id: '4',
    media: <img src="/options.png" alt="options" />,
    title: 'Options',
    text: 'Each visualizer has a set of options you can change.'
  },
  {
    id: '5',
    media: (
      <video autoPlay loop muted playsInline>
        <source src="/draggable-nodes.mp4" type="video/mp4" />
      </video>
    ),
    title: 'Draggable Nodes',
    text: 'Drag nodes and space them to your liking.'
  },
  {
    id: '6',
    media: (
      <video autoPlay loop muted playsInline>
        <source src="/explanation.mp4" type="video/mp4" />
      </video>
    ),
    title: 'Explanation',
    text: 'Scroll down to learn more about the algorithm and visualization.'
  }
]
