function Box({ children, position, scale, color, opacity, ...rest }) {
    return (
      <group scale={scale} position={position} {...rest}>
        <mesh position={[0,-0.4,0]}>
          <boxGeometry />
          <meshPhongMaterial color={color} opacity={(opacity ? opacity : 1)} transparent />
        </mesh>
        {children}
      </group>
    )
  }

export default Box;