import isArray from 'lodash-es/isArray';

export default function normalizePoint(pt) {
  if (isArray(pt)) {
    return { x: pt[0], y: pt[1] };
  }
  return pt;
}
