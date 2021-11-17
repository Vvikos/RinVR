import React, { useEffect, useRef, useState } from 'react'
import { RoundedBox, Sphere, Text } from '@react-three/drei'
import { extend, reconciler, useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, Line, Material, Mesh, MeshBasicMaterial, SplineCurve, Vector3 } from 'three'
import { useSpring, config } from 'react-spring'
import { MeshLine, MeshLineMaterial } from 'three.meshline'

extend({ MeshLine, MeshLineMaterial })

const start = new Vector3(-0.25, 1.0, -0.3)
const end = new Vector3(0.25, 1.0, -0.3)
const startEnd = new Vector3().copy(end).sub(start)

function getTargetPos(handle) {
  return new Vector3().copy(handle).sub(start).projectOnVector(startEnd).add(start)
}

const curve = new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25)

const offset = new Vector3()

let prevPinching = false

let velocity = new Vector3(0, 0, 0)
let targetPos = getTargetPos(new Vector3(0, 0, 0))

let frame = 0

export function Pinchable({ children }) {
  const { gl } = useThree();
  const hand = gl.xr.getHand(1);
  const ref = useRef();
  const lineRef = useRef();
  const v = new Vector3();
  const [label, setLabel] = useState(0);

  const [props, set] = useSpring(() => ({ scale: 1, config: config.wobbly }))

  useEffect(() => {
    if (!ref.current || !lineRef.current) return

    lineRef.current?.setPoints(curve.getPoints(20))
  }, [])

  useFrame(() => {
    if (!ref.current) return

    const handle = ref.current
    const index = hand.joints['index-finger-tip']
    const thumb = hand.joints['thumb-tip']

    let pinching = false

    frame++

    if (index && thumb) {
      const pinch = Math.max(0, 1 - index.position.distanceTo(thumb.position) / 0.1)
      pinching = pinch > 0.82
      const pointer = v.lerpVectors(index.position, thumb.position, 0.5)
      const distance = pointer.distanceTo(handle.position)

      const tDistance = 0.2
      if (distance < tDistance) {
        let scale = 1 + (0.8 - pinch) * 0.4 * (1 - distance / tDistance)
        handle.scale.set(scale, scale, scale)
      }

      handle.material.color.set(pinching ? 'hotpink' : 'white')

      // Save offset when starting to ping
      if (pinching && !prevPinching) {
        offset.copy(pointer).sub(handle.position)
      }

      // Move pointer to the hand
      if (pinching) {
        handle.position.copy(pointer).sub(offset)
        curve.points[1].copy(handle.position)
        lineRef.current?.setPoints(curve.getPoints(20))
      }
    }

    // Released
    if (prevPinching && !pinching) {
      velocity.set(0, 0, 0)
      targetPos.copy(getTargetPos(handle.position))
    }

    // return to the position
    if (!pinching) {
      const direction = new Vector3().copy(targetPos).sub(handle.position)
      velocity.add(direction.multiplyScalar(0.05))
      velocity.multiplyScalar(0.92)
      handle.position.add(velocity)
    }

    // Update line
    curve.points[1].copy(handle.position)
    lineRef.current?.setPoints(curve.getPoints(20))

    // get current position
    let value = Math.floor((getTargetPos(handle.position).sub(start).length() / startEnd.length()) * 100)
    if (frame % 5 === 0) {
      setLabel(value)
    }

    prevPinching = pinching
  })

  return (
    <>
      <Sphere args={[0.01]} position={start} />
      <Sphere args={[0.01]} position={end} />
      <mesh>
        <meshLine attach="geometry" ref={lineRef} />
        <meshLineMaterial attach="material" depthTest={true} lineWidth={0.01} color={'pink'} />
      </mesh>
      <RoundedBox args={[0.03, 0.08, 0.08]} radius={0.01} ref={ref} position={[0, 1.2, -0.3]}>
        <meshStandardMaterial />
        <Text fontSize={0.02} position={[0, 0.07, 0]}>
          {label}
        </Text>
      </RoundedBox>
    </>
  )
}