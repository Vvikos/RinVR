
import { Text } from '@react-three/drei'

function Button({ children, scale, color, fontSize, fontColor, ...rest}) {
  return (
    <group {...rest}>
      <mesh scale={scale}>
          <boxGeometry />
          <meshPhongMaterial color={color} />
      </mesh>
      <Text fontSize={fontSize} position={[0,0,0.1]} maxWidth={scale[0]-0.2} color={fontColor}>
        {children}
      </Text>
    </group>
  )
}

export default Button;