import { Color, MeshPhongMaterial, PlaneBufferGeometry} from 'three';

export const selected_light = '#ffa36e';
export const selected_darker = '#ff7221';
export const normal_light = '#6a6271';
export const normal_darker = '#523432';
export const normal_hovered = '#B0E2FF';
export const darker_panel = "#525356";
export const blue_button = "#174eab";

function hsl(h, s, l) {
  return (new Color()).setHSL(h, s, l);
}

const color_normal = hsl(0, 1, .5);
const color_selected = hsl(0.4, 1, .5);
const color_selected_first = hsl(0.33, 1, .5);
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

export const hoveredFirstMaterial = new MeshPhongMaterial({
  color: color_selected_first,
  opacity: 0.5,
  transparent: true,
});

export const selectedMaterial = new MeshPhongMaterial({
  color: color_hovered,
  opacity: 0.5,
  transparent: true,
});