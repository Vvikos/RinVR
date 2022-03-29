
import { Text } from '@react-three/drei'
import Cylinder from './Cylinder'

function RoundedButton({ children, size, color, fontSize, fontColor, position, rotation}) {
  return (
    <Cylinder color={color} size={size} position={position} rotation={rotation}>
      <Text fontSize={fontSize} rotation={[-Math.PI/2,0,0]} position={[0,0.002,0]} maxWidth={size[0]-0.2} color={fontColor}>
        {children}
      </Text>
    </Cylinder>
  )
}

export default RoundedButton;