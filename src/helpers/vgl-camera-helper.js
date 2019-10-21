import { CameraHelper } from 'three';
import VglObject3d from '../core/vgl-object3d';
import { string } from '../validators';

/**
 * This helps with visualizing what a camera contains in its frustum,
 * corresponding [THREE.CameraHelper](https://threejs.org/docs/index.html#api/helpers/CameraHelper).
 * It visualizes the frustum of a camera using a LineSegments.
 *
 * Properties of [VglObject3d](../core/vgl-object3d) are also available as mixin.
 */

export default {
  mixins: [VglObject3d],
  props: {
    /** Name of the camera to visualize. */
    camera: string,
  },
  methods: {
    setHelper() {
      if (!this.inst.children.length) {
        this.inst.add(new CameraHelper(this.vglNamespace.cameras.get(this.camera)));
      } else {
        const [helper] = this.inst.children;
        helper.camera = this.vglNamespace.cameras.get(this.camera);
        helper.camera.updateProjectionMatrix();
        helper.update();
      }
    },
  },
  created() { this.vglNamespace.beforeRender.push(this.setHelper); },
  beforeDestroy() {
    const { vglNamespace: { beforeRender }, setHelper } = this;
    beforeRender.splice(beforeRender.indexOf(setHelper), 1);
  },
};
