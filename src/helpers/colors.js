import { Color, MeshPhongMaterial, PlaneBufferGeometry} from 'three';

export const selected_light = '#ffa36e';
export const selected_darker = '#ff7221';
export const normal_light = '#ffffff';
export const normal_darker = '#dedcdc';
export const normal_hovered = '#B0E2FF';

function hsl(h, s, l) {
  return (new Color()).setHSL(h, s, l);
}

const color_normal = hsl(0, 1, .5);
const color_selected = hsl(0.4, 1, .5);
const color_hovered = hsl(0.05, 1, .5);

export const backgroundGeometry = new PlaneBufferGeometry(1, 1);

export const normalMaterial = new MeshPhongMaterial({
  color: color_normal,
  opacity: 0.05,
  transparent: true,
});

export const hoveredMaterial = new MeshPhongMaterial({
  color: color_selected,
  opacity: 0.5,
  transparent: true,
});

export const selectedMaterial = new MeshPhongMaterial({
  color: color_hovered,
  opacity: 0.5,
  transparent: true,
});