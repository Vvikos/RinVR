import { useMemo } from 'react';
import { MeshBasicMaterial, FrontSide, PlaneBufferGeometry, CanvasTexture, LinearFilter, RepeatWrapping } from 'three';

function TextSprite({ children, position, scale, backgroundMaterial, color = 'white', fontSize = 50 }) {
 
    const labelMaterial = useMemo(() => {
        var fontface = "Arial";
        var fontsize = fontSize;
        var borderThickness =  0;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        //var metrics = context.measureText( children );
        //var textWidth = metrics.width;
        
        canvas.width = 1080;
        canvas.height = fontSize;
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;

        context.lineWidth = borderThickness;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = color;
        context.fillText(children, 0, 0, canvas.width);
        
        var texture = new CanvasTexture(canvas);
        // because our canvas is likely not a power of 2
        // in both dimensions set the filtering appropriately.
        texture.minFilter = LinearFilter;
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        const labelMaterial = new MeshBasicMaterial({
            map: texture,
            side: FrontSide,
            transparent: true,
          });

        return labelMaterial;

    }, [children]);

    const labelGeometry = new PlaneBufferGeometry(0.8, 1);
    const backgroundGeometry = new PlaneBufferGeometry(1, 1);

    return (
      <mesh scale={scale} position={position} geometry={backgroundGeometry} material={backgroundMaterial} >
        <mesh position={[0.05, 0, 1]} geometry={labelGeometry} material={labelMaterial} />
      </mesh>
    )
  }

export default TextSprite;