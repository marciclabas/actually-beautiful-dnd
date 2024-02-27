import { VStack } from '@chakra-ui/react'
import { DragDropContext } from 'react-beautiful-dnd'

export function AnimationDnd() {
  return (
    <VStack h='100vh' w='100vw' justify='center' align='center'>
      <DragDropContext></DragDropContext>
    </VStack>
  )
}

export default AnimationDnd