export const INDIA_CENTER = { lat: 22.5937, lng: 78.9629 };

export const STATE_CENTERS = {
  Maharashtra: { lat: 19.7515, lng: 75.7139 },
  Karnataka: { lat: 15.3173, lng: 75.7139 },
  Rajasthan: { lat: 27.0238, lng: 74.2179 },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
  Gujarat: { lat: 22.2587, lng: 71.1924 },
  'West Bengal': { lat: 22.9868, lng: 87.855 },
  Kerala: { lat: 10.8505, lng: 76.2711 },
  'Andhra Pradesh': { lat: 15.9129, lng: 79.74 },
  'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
};

export const getDistrictCenter = (state, districtIndex = 0) => {
  const center = STATE_CENTERS[state] || INDIA_CENTER;
  return {
    lat: center.lat + districtIndex * 0.32,
    lng: center.lng + districtIndex * 0.28,
  };
};

export const getBlockCenter = (state, districtIndex = 0, blockIndex = 0) => {
  const center = getDistrictCenter(state, districtIndex);
  return {
    lat: center.lat + blockIndex * 0.045,
    lng: center.lng + blockIndex * 0.04,
  };
};
