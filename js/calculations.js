window.Calculations = (() => {
  const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
  function distanceKm(a,b) { const r=6371,dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng),h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;return 2*r*Math.atan2(Math.sqrt(h),Math.sqrt(1-h)); }
  function bearing(a,b) { const y=Math.sin(rad(b.lng-a.lng))*Math.cos(rad(b.lat)),x=Math.cos(rad(a.lat))*Math.sin(rad(b.lat))-Math.sin(rad(a.lat))*Math.cos(rad(b.lat))*Math.cos(rad(b.lng-a.lng));return (deg(Math.atan2(y,x))+360)%360; }
  function routeDistance(points) { return points.slice(1).reduce((sum,point,index)=>sum+distanceKm(points[index],point),0); }
  function windAdjustedSpeed(airSpeed, course, windSpeed, fromDirection) { return Math.max(5,airSpeed+windSpeed*Math.cos(rad((fromDirection+180)%360)-rad(course))); }
  function flightMetrics(points,settings) { const legs=points.slice(1).map((point,index)=>{const distance=distanceKm(points[index],point),course=bearing(points[index],point),wind=settings.windAtAltitude?.(point.altitudeM??settings.altitude)||{speed:settings.windSpeed,direction:settings.windDirection},speed=windAdjustedSpeed(settings.speed,course,point.windSpeed??wind.speed,point.windDirection??wind.direction);return {distance,course,speed,hours:distance/speed};});const distance=legs.reduce((sum,leg)=>sum+leg.distance,0),hours=legs.reduce((sum,leg)=>sum+leg.hours,0),usedMinutes=hours*60,remainingMinutes=settings.battery-usedMinutes;return {legs,distance,hours,usedMinutes,remainingMinutes,remainingPercent:Math.max(0,Math.round(remainingMinutes/settings.battery*100)),ground:legs.at(-1)?.speed||0,course:legs.at(-1)?.course||0}; }
  function formatTime(hours) { const minutes=Math.round(hours*60);return minutes<60?`${minutes} хв`:`${Math.floor(minutes/60)} год ${minutes%60} хв`; }
  function terrain(points) { const seed=points.reduce((sum,p)=>sum+p.lat*7+p.lng*11,0)||1;return Array.from({length:24},(_,i)=>Math.round(125+34*Math.sin(i*.42+seed)+18*Math.sin(i*1.05+seed/3))); }
  return {distanceKm,bearing,routeDistance,windAdjustedSpeed,flightMetrics,formatTime,terrain};
})();
