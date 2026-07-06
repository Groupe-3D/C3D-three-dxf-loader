import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { DXFLoader, type DXFLoadResult, THREEx } from '../src/loader/index.js';
import { Viewer } from '../src/viewer/index.js';

const fontLoader = new FontLoader();

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const loader = new DXFLoader();
  loader.setFont(font);
  loader.setEnableLayer(true);
  loader.setDefaultColor(0x000000);
  loader.setConsumeUnits(true);

  const scene = new THREE.Scene();

  const onLoad = (data: DXFLoadResult) => {
    scene.add(data.entity);
    console.log(data.dxf.entities.length);
  };
  const onError = (error: unknown) => console.log(error);
  const onProgress = (xhr: ProgressEvent) =>
    console.log((xhr.loaded / xhr.total) * 100);

  loader.load('foo.dxf', onLoad, onProgress, onError);

  const parsed = loader.parse('0\nSECTION\n');
  scene.add(parsed.entity);

  console.log(THREEx.FontLoader, THREEx.TextGeometry);

  const viewer = new Viewer(
    parsed.dxf,
    document.createElement('div'),
    800,
    600,
    font,
  );
  viewer.render();
  viewer.resize(400, 300);
});
