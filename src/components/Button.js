/**
 * @module Button
 */
import { Text } from '@react-three/drei'
import { BoxGeometry } from "three";

const box = new BoxGeometry();

/**
 * Créer un bouton en 3D
 * @param {} children - Fils qui hérite
 * @param {} scale - Echelle
 * @param {} color - Couleur
 * @param {} fontSize - Taille de la police
 * @param {} fontColor - Couleur de la police
 * @param {} position - Position
 * @returns {} - Mesh qui contient un bouton avec son texte
 */
function Button({ children, scale, color, fontSize, fontColor, position }) {
  return (
    <>
      <mesh position={position} scale={scale} geometry={box}>
        <meshPhongMaterial color={color} />
      </mesh>
      <Text anchorX="center" anchorY="middle" scale={[1, scale[1]*20, scale[2]]} fontSize={fontSize} position={[position[0],position[1],position[2]+1]} maxWidth={scale[0]-0.2} color={fontColor}>
        {children}
      </Text>
    </>
  )
}

export default Button;