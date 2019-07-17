/* eslint-disable security/detect-object-injection */
export function formatJoiError(error) {
  const errors = {};
  error.details.forEach(err => {
    const path = err.path[0];
    if (!errors[path]) errors[path] = [];
    errors[path].push(err.message);
  });
  return errors;
}
