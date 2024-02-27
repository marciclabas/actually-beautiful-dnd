import { Text, VStack, HStack, Box, Button } from '@chakra-ui/react'
import { range } from './util'
import { Item, useReorder } from './use-reorder'
import { SensorAPI } from 'react-beautiful-dnd'
import { delay } from 'framer-animations'

const items: Item[] = [...range(4)].map(i => ({
  id: `${i}`, elem: idx => (
    <Box>
      <Text>Page {i} [Index {idx}]</Text>
    </Box>
  )
}))

export function App() {
  
  const { reorderer, animate } = useReorder(items)

  async function swapAnimation(api: SensorAPI): Promise<boolean> {
    const lock = api.tryGetLock('0')
    if (!lock)
      return false

    const lift = lock.snapLift()
    await delay(0.1)
    lift.moveDown()
    await delay(0.5)
    lift.moveUp()
    await delay(0.1)
    lift.drop()

    return true
  }
  function swap() {
    if (animate)
      swapAnimation(animate)
  }

  return (
    <VStack h='100vh' w='100vw' justify='center' align='center'>
      <VStack h='80%' w='80%' justify='center' align='center' border='2px solid red'>
        {reorderer}
      </VStack>
      <Button onClick={swap}>Swap</Button>
    </VStack>
  )
}

export default App