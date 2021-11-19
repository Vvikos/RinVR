import { Text } from '@react-three/drei'
import Box from './Box'

function Console({logs, rotation, position}){
  return (
    <Box size={[8, 4, 0]} position={position} rotation={rotation} color={0xf5f3ed}>
      <Text anchorX="left" anchorY="top-baseline" position={[-3.7,1.7,0.1]} maxWidth={7.5} color="black" fontSize={0.15}>{'CONSOLE LOGS'}</Text>
      <Text anchorX="left" anchorY="top-baseline" position={[-3.7,1.4,0.1]} maxWidth={7.5} color="black" fontSize={0.09}>{logs+"\n>"}</Text>
    </Box>
  )
}

export default Console;