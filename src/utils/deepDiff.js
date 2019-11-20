import { transform, isEqual, isObject } from "lodash/fp";

const _transform = transform.convert({
  cap: false
});

const iteratee = (baseObj, include) => (result, value, key) => {
  if (!isEqual(value, baseObj[key]) && (baseObj[key] || include)) {
    const valIsObj = isObject(value) && isObject(baseObj[key]);
    result[key] = valIsObj === true ? deepDiff(value, baseObj[key]) : value;
  }
};

export default function deepDiff(targetObj, baseObj, includeNonExistKey = true) {
  return _transform(iteratee(baseObj, includeNonExistKey), null, targetObj);
}