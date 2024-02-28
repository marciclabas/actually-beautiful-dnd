import { Box, Button, Flex, Image, Text, VStack } from '@chakra-ui/react'
import { range } from '../../util/arrays'
import { Item, ItemProps } from '../../lib/use-reorder'
import { useAnimatedReorder } from '../../lib/use-reorder/animated'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

export function Animation() {

  const items: Item[] = range(3).map(i => ({
    id: `${i}`, elem: ({ idx }: ItemProps) => (
      <VStack align='center' h='25vh' w='25vh' pos='relative' bg={`gray.${i * 100 + 300}`}>
        <Flex pos='absolute' top={0} left={0} w='100%' h='100%' align='center' justify='center'>
          <Text fontSize='2rem'>{idx}</Text>
        </Flex>
      </VStack>
    )
  }))

  const { reorderer, run } = useAnimatedReorder(items, {
    timeForLongPress: 0, forcePressThreshold: 0,
    animation: {
      modalStyle: {
        borderRadius: 0, background: 'transparent'
      }
    }
  })

  useEffect(() => { run() }, [])

  return (
    <>
      <VStack h='80%' pos='relative'>
        {reorderer}
      </VStack>
      <Button onClick={run}>Animation</Button>
    </>
  )
}

export function App() {

  const [mount, setMount] = useState(false)

  return (
    <VStack h='100vh' w='100vw' justify='center' align='center'>
      <Button onClick={() => setMount(x => !x)}>Toggle</Button>
      <AnimatePresence initial={false}>
        {mount && <Animation />}
      </AnimatePresence>
    </VStack>
  )
}

export default App