import type { IDxf } from 'dxf-parser';
import type { WebGLRenderer } from 'three';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';

/**
 * Renders a parsed DXF object into a THREE.js scene attached to `parent`,
 * with orbit controls wired up.
 */
export class Viewer {
  constructor(
    data: IDxf,
    parent: HTMLElement,
    width?: number,
    height?: number,
    font?: Font,
  );

  readonly renderer: WebGLRenderer;

  render(): void;
  resize(width: number, height: number): void;
}

export { default as THREEx } from '../loader/extend.js';
