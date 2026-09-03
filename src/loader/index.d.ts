import type { IDxf } from 'dxf-parser'
import type { ColorRepresentation, Group, Loader, LoadingManager } from 'three'
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js'

/**
 * The drawing unit resolved from the DXF header's `$INSUNITS` code.
 */
export interface DXFUnits {
  /** Raw `$INSUNITS` code, `0` when the header omits it. */
  code: number
  /** Full unit name, e.g. `'Millimeters'`. Empty for an unrecognised code. */
  name: string
  /** Unit abbreviation, e.g. `'mm'`. Empty for unitless or unrecognised codes. */
  abbr: string
  /** Scale factor from this unit to meters. */
  toMeter: number
}

/**
 * The DXF format version, passed through as the raw `$ACADVER` code. It is not
 * mapped to a release year, since one code spans several AutoCAD releases.
 */
export interface DXFVersion {
  code: string | undefined
}

/**
 * Parsed DXF, with the unit and version resolved off the header.
 */
export type DXFData = IDxf & {
  units: DXFUnits
  version: DXFVersion
}

/**
 * Attached to `Object3D.userData.dxfInfo` on every object the loader draws, so
 * a picked object can be traced back to its source entity. The full entity
 * record stays available on the returned `dxf`.
 *
 * 3DFACE entities are merged per layer, so those objects carry only `type` and
 * `layer` -- there is no single source entity to point at.
 */
export interface DXFEntityInfo {
  /** Stable entity id. Absent on merged 3DFACE objects. */
  handle?: string
  ownerHandle?: string
  type: string
  layer?: string
  lineType?: string
  lineTypeScale?: number
  colorIndex?: number
  inPaperSpace?: boolean
}

/**
 * Result of loading/parsing a DXF file.
 */
export interface DXFLoadResult {
  entity: Group
  dxf: DXFData
}

/**
 * Options accepted by {@link DXFLoader.loadEntities}. A `DXFLoader` instance
 * itself satisfies this shape, which is what `loadEntities` defaults to.
 */
export interface DXFLoadOptions {
  font?: Font | null
  enableLayer?: boolean
  defaultColor?: ColorRepresentation
  enableUnitConversion?: boolean
}

/**
 * THREE.Loader implementation for DXF files.
 *
 * @see https://threejs.org/docs/#api/en/loaders/Loader
 */
export class DXFLoader extends Loader<DXFLoadResult> {
  constructor(manager?: LoadingManager)

  font: Font | null
  enableLayer: boolean
  defaultColor: ColorRepresentation
  enableUnitConversion: boolean

  setFont(font: Font): this
  setEnableLayer(enableLayer: boolean): this
  setDefaultColor(color: ColorRepresentation): this
  setConsumeUnits(enable: boolean): void

  loadString(
    text: string,
    onLoad: (data: DXFLoadResult) => void,
    onError?: (err: unknown) => void
  ): void

  parse(text: string): DXFLoadResult

  loadEntities(data: IDxf, options?: DXFLoadOptions): DXFLoadResult
}

export { default as THREEx } from './extend.js'
