
import { Text } from '@react-three/drei'
import { BoxGeometry } from "three";

const box = new BoxGeometry();

function Button({ children, scale, color, fontSize, fontColor, ...rest}) {
  return (
    <group {...rest}>
      <mesh scale={scale} geometry={box}>
        <meshPhongMaterial color={color} />
      </mesh>
      <Text anchorX="center" anchorY="middle" fontSize={fontSize} position={[0,0,10]} maxWidth={scale[0]-0.2} color={fontColor}>
        {children}
      </Text>
    </group>
  )
}

export default Button;