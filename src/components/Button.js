
import { Text } from '@react-three/drei'
import Box from './Box'

function Button({ children, size, color, fontSize, fontColor, ...rest}) {
  return (
    <Box color={color} size={size} {...rest}>
      <Text fontSize={fontSize} position={[0,0,0.025]} maxWidth={size[0]-0.2} color={fontColor}>
        {children}
      </Text>
    </Box>
  )
}

export default Button;