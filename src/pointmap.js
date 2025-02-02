// Map type using point as key ([ x, y]). Uses underlying default Map() object and chains collisions
// that occur with a pretty good int32 hashing algorithm (small tens of collisions for hundreds of thousands of GeoJSON points)
// so chaining is not necessary much and mostly get Map performance.

import pointHash from "./pointhash.js"
import pointEqual from "./pointequal.js"

export default function() {
  let map = new Map();
  let _length = 0;

  function has(p) {
    let i = pointHash(p);
    let e = map.get(i);
    for (; e; e = e.next)
      if (pointEqual(e.p, p))
        return true;
    return false;
  }

  function set(p, v) {
    let i = pointHash(p);
    let e = map.get(i);
    for (let c = e; c; c = c.next)
      if (pointEqual(c.p, p)) {
        c.v = v;
        return v;
      }
    _length++;
    map.set(i, { p: p, v: v, next: e });
    return v;
  }

  function get(p) {
    let i = pointHash(p);
    for (let e = map.get(i); e; e = e.next)
      if (pointEqual(e.p, p))
        return e.v;
    return undefined;
  }

  function forEach(cb) {
    map.forEach(e => {
        for (; e; e = e.next)
          cb(e.v, e.p);
      });
  }

  function length() {
    return _length;
  }

  return ({ has, set, get, forEach, length });
}

