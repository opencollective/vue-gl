import { DodecahedronBufferGeometry } from 'three';
import VglGeometry from '../core/vgl-geometry';
import { number } from '../types';

/**
 * A component for generating a dodecahedron geometries,
 * corresponding [THREE.DodecahedronGeometry](https://threejs.org/docs/index.html#api/geometries/DodecahedronGeometry).
 *
 * Properties of [VglGeometry](../core/vgl-geometry) are also available as mixin.
 */

export default {
  mixins: [VglGeometry],
  props: {
    /** Radius of the dodecahedron. */
    radius: { type: number, default: 1 },
    /** Setting this to a value greater than 0 adds vertices making it no longer a dodecahedron. */
    detail: { type: number, default: 0 },
  },
  computed: {
    inst() {
      return new DodecahedronBufferGeometry(parseFloat(this.radius), parseInt(this.detail, 10));
    },
  },
};
