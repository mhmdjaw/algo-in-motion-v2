import { Carousel } from '@mantine/carousel'
import { Button, FocusTrap, Modal, Text } from '@mantine/core'
import styles from './Tutorial.module.css'
import { useDisclosure } from '@mhmdjawhar/react-hooks'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

export function Tutorial() {
  const [opened, { close }] = useDisclosure(true)

  return (
    <Modal
      opened={opened}
      size="xl"
      withCloseButton={false}
      padding={0}
      onClose={close}
      classNames={{
        content: styles.modalContent,
        body: styles.modalBody,
        inner: styles.modalInner
      }}
      centered
      lockScroll={false}
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
        <Carousel.Slide>
          <div className={styles.slideMedia}>
            <img
              src="https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
              alt="Cat"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div className={styles.slideContent}>
            <Text className={styles.slideTitle}>Welcome!</Text>
            <Text>Feel free to skip the tutorial by clicking the button below.</Text>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className={styles.slideMedia}>
            <img
              src="https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
              alt="Cat"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div className={styles.slideContent}>
            <Text className={styles.slideTitle}>Welcome!</Text>
            <Text>
              Choose your algorithm from the menu list. Use the action button to run the visualizer
              or reset it. Each visualizer has a set of options you can control.
            </Text>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className={styles.slideMedia}>
            <img
              src="https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
              alt="Cat"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div className={styles.slideContent}>
            <Text className={styles.slideTitle}>Welcome!</Text>
            <Text>Feel free to skip the tutorial by clicking the button below.</Text>
          </div>
        </Carousel.Slide>
      </Carousel>
      <div className={styles.buttonContainer}>
        <Button variant="retro-secondary" size="sm" onClick={close}>
          Skip Tutorial
        </Button>
      </div>
    </Modal>
  )
}
