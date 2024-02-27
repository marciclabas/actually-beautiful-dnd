import { Box, Button, Flex, Image, Text, VStack } from '@chakra-ui/react'
import { useReorder } from '../../lib/use-reorder'
import { Item, ItemProps } from '../../lib/use-reorder/reorder'
import { range } from '../../lib/use-reorder/util'
import { MdPanToolAlt } from 'react-icons/md'
import { useReorderAnimation } from './animation/animation'
import { memo } from 'react'
import { Modal } from 'framer-animations'


export function App() {
  
  const { run, backgroundAnimation, itemAnimation, modal } = useReorderAnimation('0', {
    // handIcon: <MdPanToolAlt color='white' fontSize='5rem' />
  })

  const items: Item[] = [...range(3)].map(i => ({
    id: `${i}`, elem: memo(({ idx }: ItemProps) => (
      <VStack align='center' h='25vh' w='25vh' pos='relative'>
        <Image maxH='100%' src={`/images/sheet${i % 2}.jpg`} />
        <Flex pos='absolute' top={0} left={0} w='100%' h='100%' align='center' justify='center'>
          <Text fontSize='2rem'>{idx}</Text>
        </Flex>
        {idx === 0 && (
          <Modal show={modal}>
            {itemAnimation}
          </Modal>
        )}
      </VStack>
    ))
  }))
  
  const { reorderer, animate } = useReorder(items, {
    timeForLongPress: 0, forcePressThreshold: 0
  })

  async function runAnimation() {
    if (animate)
      run(animate)
  }


  return (
    <VStack h='100vh' w='100vw' justify='center' align='center'>
      <VStack h='90%' pos='relative'>
        {reorderer}
        {backgroundAnimation}
      </VStack>
      <Button onClick={() => {runAnimation()}}>Run</Button>
    </VStack>
  )
}

export default App