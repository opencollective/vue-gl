import VglMaterial from './materials/vgl-material';
import VglObject3d from './core/vgl-object3d';
import { parseNames } from './parsers';

export const VglObject3dWithMatarial = {
  mixins: [VglObject3d],
  methods: {
    setMaterial() {
      const { vglNamespace: { materials }, inst } = this;
      const parsedMaterials = parseNames(this.material).reduce(
        (acc, current) => (materials.get(current) ? [...acc, materials.get(current)] : acc), [],
      );
      inst.material = parsedMaterials.length === 1 ? parsedMaterials[0] : parsedMaterials;
      this.vglObject3d.emit();
    },
  },
  watch: {
    inst() {
      if (this.material !== undefined) {
        this.setMaterial();
      }
    },
    material: {
      handler(material, oldMaterial) {
        const { vglNamespace: { materials }, setMaterial } = this;
        if (oldMaterial !== undefined) {
          parseNames(oldMaterial).forEach((oldName) => materials.unlisten(oldName, setMaterial));
        }
        if (material !== undefined) {
          parseNames(material).forEach((name) => materials.listen(name, setMaterial));
          setMaterial();
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    const { vglNamespace: { materials }, material, setMaterial } = this;
    parseNames(material).forEach((name) => materials.unlisten(name, setMaterial));
  },
};

export const VglObject3dWithMatarialAndGeometry = {
  mixins: [VglObject3dWithMatarial],
  methods: {
    setGeometry(geometry) {
      if (geometry) {
        this.inst.geometry = geometry;
        this.vglObject3d.emit();
        if (this.name !== undefined) this.vglNamespace.object3ds.emit(this.name, this.inst);
      }
    },
  },
  watch: {
    inst() {
      if (this.geometry !== undefined) {
        this.setGeometry(this.vglNamespace.geometries.get(this.geometry));
      }
    },
    geometry: {
      handler(geometry, oldGeometry) {
        const { vglNamespace: { geometries }, setGeometry } = this;
        if (oldGeometry !== undefined) geometries.unlisten(oldGeometry, setGeometry);
        if (geometry !== undefined) {
          geometries.listen(geometry, setGeometry);
          setGeometry(geometries.get(geometry));
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() { this.vglNamespace.geometries.unlisten(this.geometry, this.setGeometry); },
};

export const VglMaterialWithMap = {
  mixins: [VglMaterial],
  methods: {
    setMap() {
      const { vglNamespace: { textures }, inst, map } = this;
      if (textures.keys().includes(map)) inst.map = textures.get(map);
      this.vglNamespace.materials.emit(this.name, inst);
    },
  },
  watch: {
    inst() {
      if (this.map !== undefined) this.setMap(this.vglNamespace.textures.get(this.map));
    },
    map: {
      handler(map, oldMap) {
        const { vglNamespace: { textures }, setMap } = this;
        if (oldMap !== undefined) textures.unlisten(oldMap, setMap);
        if (map !== undefined) {
          textures.listen(map, setMap);
          setMap(textures.get(map));
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() { this.vglNamespace.textures.unlisten(this.map, this.setMap); },
};
