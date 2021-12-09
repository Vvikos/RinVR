
import { Text } from '@react-three/drei'
import Box from './Box'

function Button({ children, size, color, fontSize, fontColor, ...rest}) {
  return (
    <Box color={color} size={size} {...rest}>
      <Text fontSize={fontSize} position={[0,0,0.06]} maxWidth={size[0]-0.2} color={fontColor} anchorX="middle" anchorY="middle">
        {children}
      </Text>
    </Box>
  )
}

export default Button;