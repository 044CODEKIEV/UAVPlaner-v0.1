window.Route = (() => {
  let points = [];
  const add = point => { points.push({ lat: point.lat, lng: point.lng, altitudeM:point.altitudeM??null, windSpeed:point.windSpeed??null, windDirection:point.windDirection??null }); return points; };
  const update = (index, point) => { if (points[index]) points[index] = { ...points[index], ...point }; return points; };
  const remove = index => { points.splice(index, 1); return points; };
  const clear = () => { points = []; return points; };
  return { add, update, remove, clear, get: () => points.map(point => ({ ...point })) };
})();
