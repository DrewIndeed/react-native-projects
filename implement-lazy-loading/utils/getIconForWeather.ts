const icons: any = {
  Clear: '☀️',
  Hail: '⛆',
  'Heavy Cloud': '☁️',
  'Light Cloud': '⛅',
  'Heavy Rain': '⛈️',
  'Light Rain': '🌧️',
  Showers: '🌧️',
  Sleet: '🌨️',
  Snow: '❄️',
  Thunder: '⛈️',
};

export default (weather: string) => icons[weather];
