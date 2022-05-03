
import { Text } from '@react-three/drei'
import { BoxGeometry } from "three";

const box = new BoxGeometry();

function Button({ children, scale, color, fontSize, fontColor, position }) {
  return (
    <>
      <mesh position={position} scale={scale} geometry={box}>
        <meshPhongMaterial color={color} />
      </mesh>
      <Text anchorX="center" anchorY="middle" scale={[1, scale[1]*20, scale[2]]} fontSize={fontSize} position={[position[0],position[1],position[0]+1]} maxWidth={scale[0]-0.2} color={fontColor}>
        {children}
      </Text>
    </>
  )
}

export default Button;