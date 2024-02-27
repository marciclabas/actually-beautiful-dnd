import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react'
import { useReorder } from '../../lib/use-reorder'
import { Item, ItemProps } from '../../lib/use-reorder/reorder'
import { range } from '../../lib/use-reorder/util'

const items: Item[] = [...range(6)].map(i => ({
  id: `${i}`, elem: ({ idx }: ItemProps) => (
    <VStack align='center' h='25vh' w='25vh' pos='relative' border='1px solid green'>
      <Image maxH='100%' src={`/images/sheet${i%2}.jpg`} />
      <Flex pos='absolute' top={0} left={0} w='100%' h='100%' align='center' justify='center'>
        <Text fontSize='2rem'>{idx}</Text>
      </Flex>
    </VStack>
  )
}))

export function App() {
  const { reorderer } = useReorder(items)
  return (
    <VStack h='100vh' w='100vw' justify='center' align='center'>
      <VStack h='100%' overflowY='scroll' border='1px solid red'>
        {reorderer}
      </VStack>
    </VStack>
  )
}

export default App