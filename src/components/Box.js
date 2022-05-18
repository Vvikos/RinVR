/**
 * @module Box
 */

import { BoxGeometry } from "three";

const box = new BoxGeometry();

/**
 * Créer un cube en 3D
 * @param {} children - Fils qui hérite
 * @param {} position - Position
 * @param {} scale - Echelle
 * @param {} color - Couleur
 * @param {} opacity - Opacité
 * @returns {} - Mesh qui contient une box avec les propriétés
 */
function Box({ children, position, scale, color, opacity, ...rest }) {
    return (
      <group scale={scale} position={position} {...rest}>
        <mesh position={[0,-0.4,0]} geometry={box}>
          <meshPhongMaterial color={color} opacity={(opacity ? opacity : 1)} transparent />
        </mesh>
        {children}
      </group>
    )
  }

export default Box;