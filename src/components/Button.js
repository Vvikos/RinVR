
import { Text } from '@react-three/drei'
import Box from './Box'

function Button({ children, scale, color, fontSize, fontColor, ...rest}) {
  return (
    <mesh {...rest}>
      <Box color={color} scale={scale}></Box>
      <Text fontSize={fontSize} position={[0,-scale[1]/2.,0.025]} maxWidth={scale[0]-0.2} color={fontColor}>
        {children}
      </Text>
    </mesh>
  )
}

export default Button;