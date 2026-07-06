import type { IDxf } from 'dxf-parser';
import type { ColorRepresentation, Group, Loader, LoadingManager } from 'three';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';

/**
 * Result of loading/parsing a DXF file.
 */
export interface DXFLoadResult {
  entity: Group;
  dxf: IDxf;
}

/**
 * Options accepted by {@link DXFLoader.loadEntities}. A `DXFLoader` instance
 * itself satisfies this shape, which is what `loadEntities` defaults to.
 */
export interface DXFLoadOptions {
  font?: Font | null;
  enableLayer?: boolean;
  defaultColor?: ColorRepresentation;
  enableUnitConversion?: boolean;
}

/**
 * THREE.Loader implementation for DXF files.
 *
 * @see https://threejs.org/docs/#api/en/loaders/Loader
 */
export class DXFLoader extends Loader<DXFLoadResult> {
  constructor(manager?: LoadingManager);

  font: Font | null;
  enableLayer: boolean;
  defaultColor: ColorRepresentation;
  enableUnitConversion: boolean;

  setFont(font: Font): this;
  setEnableLayer(enableLayer: boolean): this;
  setDefaultColor(color: ColorRepresentation): this;
  setConsumeUnits(enable: boolean): void;

  loadString(
    text: string,
    onLoad: (data: DXFLoadResult) => void,
    onError?: (err: unknown) => void,
  ): void;

  parse(text: string): DXFLoadResult;

  loadEntities(data: IDxf, options?: DXFLoadOptions): DXFLoadResult;
}

export { default as THREEx } from './extend.js';
