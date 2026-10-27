import type { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import type { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

export interface THREEExtensions {
  FontLoader?: typeof FontLoader
  TextGeometry?: typeof TextGeometry
  /**
   * Resolves once `FontLoader` and `TextGeometry` have been resolved, either
   * from `three` itself or from the lazy `three/examples/jsm` imports.
   *
   * Drawing TEXT entities before this settles silently skips them, so await it
   * first if the drawing has text.
   */
  ready?: Promise<unknown>
}

declare const THREEx: THREEExtensions

export default THREEx
