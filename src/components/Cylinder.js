function Cylinder({ color, size, scale, children, ...rest }) {
    return (
      <mesh scale={scale} {...rest}>
        <cylinderBufferGeometry attach="geometry" args={size} />
        <meshPhongMaterial attach="material" color={color} />
        {children}
      </mesh>
    )
  }

export default Cylinder;