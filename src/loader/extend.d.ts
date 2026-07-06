import type { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export interface THREEExtensions {
  FontLoader?: typeof FontLoader;
  TextGeometry?: typeof TextGeometry;
}

declare const THREEx: THREEExtensions;

export default THREEx;
