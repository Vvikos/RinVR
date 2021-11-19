function Box({ color, size, scale, children, ...rest }) {
    return (
      <mesh scale={scale} {...rest}>
        <boxBufferGeometry attach="geometry" args={size} />
        <meshPhongMaterial attach="material" color={color} />
        {children}
      </mesh>
    )
  }

export default Box;