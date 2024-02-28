import { Box, Button, Flex, Image, Text, VStack } from '@chakra-ui/react'
import { range } from '../../util/arrays'
import { Item, ItemProps } from 'use-reorder'
import { useAnimatedReorder } from 'use-reorder/dist/animated'

export function App() {

  const items: Item[] = range(3).map(i => ({
    id: `${i}`, elem: ({ idx }: ItemProps) => (
      <VStack align='center' h='25vh' w='25vh' pos='relative' bg={`gray.${i*100+300}`}>
        {/* <Image maxH='100%' src={`/images/sheet${i % 2}.jpg`} /> */}
        <Flex pos='absolute' top={0} left={0} w='100%' h='100%' align='center' justify='center'>
          <Text fontSize='2rem'>{idx}</Text>
        </Flex>
      </VStack>
    )
  }))
  
  const { reorderer, run } = useAnimatedReorder(items, {
    timeForLongPress: 0, forcePressThreshold: 0,
    animation: { modalStyle: {
      borderRadius: 0, background: 'transparent'
    }}
  })


  return (
    <VStack h='100vh' w='100vw' justify='center' align='center'>
      <VStack h='80%' pos='relative'>
        {reorderer}
      </VStack>
      <Button onClick={run}>Animation</Button>
    </VStack>
  )
}

export default App