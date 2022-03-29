function Cylinder({ color, scale, children, ...rest }) {
    return (
      <mesh scale={scale} {...rest}>
        <cylinderBufferGeometry attach="geometry" />
        <meshPhongMaterial attach="material" color={color} />
        {children}
      </mesh>
    )
  }

export default Cylinder;