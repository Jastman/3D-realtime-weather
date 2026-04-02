/**
 * Major airports lookup: IATA code → { name, city, country, lat, lon }
 * Used for turbulence-mode flight route visualization.
 */
export const AIRPORTS = {
  // ── United States ────────────────────────────────────────────────────────
  ATL: { name: 'Hartsfield-Jackson Atlanta Intl', city: 'Atlanta, GA', country: 'US', lat: 33.6367, lon: -84.4281 },
  LAX: { name: 'Los Angeles International', city: 'Los Angeles, CA', country: 'US', lat: 33.9425, lon: -118.4081 },
  ORD: { name: "O'Hare International", city: 'Chicago, IL', country: 'US', lat: 41.9742, lon: -87.9073 },
  DFW: { name: 'Dallas/Fort Worth International', city: 'Dallas, TX', country: 'US', lat: 32.8998, lon: -97.0403 },
  JFK: { name: 'John F. Kennedy International', city: 'New York, NY', country: 'US', lat: 40.6413, lon: -73.7781 },
  LGA: { name: 'LaGuardia Airport', city: 'New York, NY', country: 'US', lat: 40.7772, lon: -73.8726 },
  EWR: { name: 'Newark Liberty International', city: 'Newark, NJ', country: 'US', lat: 40.6895, lon: -74.1745 },
  SFO: { name: 'San Francisco International', city: 'San Francisco, CA', country: 'US', lat: 37.6213, lon: -122.3790 },
  SEA: { name: 'Seattle-Tacoma International', city: 'Seattle, WA', country: 'US', lat: 47.4502, lon: -122.3088 },
  DEN: { name: 'Denver International', city: 'Denver, CO', country: 'US', lat: 39.8561, lon: -104.6737 },
  LAS: { name: 'Harry Reid International', city: 'Las Vegas, NV', country: 'US', lat: 36.0840, lon: -115.1537 },
  MCO: { name: 'Orlando International', city: 'Orlando, FL', country: 'US', lat: 28.4312, lon: -81.3081 },
  CLT: { name: 'Charlotte Douglas International', city: 'Charlotte, NC', country: 'US', lat: 35.2140, lon: -80.9431 },
  MIA: { name: 'Miami International', city: 'Miami, FL', country: 'US', lat: 25.7959, lon: -80.2870 },
  PHX: { name: 'Phoenix Sky Harbor International', city: 'Phoenix, AZ', country: 'US', lat: 33.4373, lon: -112.0078 },
  IAH: { name: 'George Bush Intercontinental', city: 'Houston, TX', country: 'US', lat: 29.9902, lon: -95.3368 },
  HOU: { name: 'William P. Hobby Airport', city: 'Houston, TX', country: 'US', lat: 29.6454, lon: -95.2789 },
  BOS: { name: 'Logan International', city: 'Boston, MA', country: 'US', lat: 42.3656, lon: -71.0096 },
  MSP: { name: 'Minneapolis-St Paul International', city: 'Minneapolis, MN', country: 'US', lat: 44.8820, lon: -93.2218 },
  DTW: { name: 'Detroit Metropolitan Wayne County', city: 'Detroit, MI', country: 'US', lat: 42.2124, lon: -83.3534 },
  PHL: { name: 'Philadelphia International', city: 'Philadelphia, PA', country: 'US', lat: 39.8719, lon: -75.2411 },
  BWI: { name: 'Baltimore/Washington International', city: 'Baltimore, MD', country: 'US', lat: 39.1754, lon: -76.6683 },
  DCA: { name: 'Ronald Reagan Washington National', city: 'Washington, DC', country: 'US', lat: 38.8521, lon: -77.0377 },
  IAD: { name: 'Washington Dulles International', city: 'Dulles, VA', country: 'US', lat: 38.9531, lon: -77.4565 },
  SAN: { name: 'San Diego International', city: 'San Diego, CA', country: 'US', lat: 32.7338, lon: -117.1933 },
  TPA: { name: 'Tampa International', city: 'Tampa, FL', country: 'US', lat: 27.9755, lon: -82.5332 },
  PDX: { name: 'Portland International', city: 'Portland, OR', country: 'US', lat: 45.5898, lon: -122.5951 },
  STL: { name: 'St. Louis Lambert International', city: 'St. Louis, MO', country: 'US', lat: 38.7487, lon: -90.3700 },
  BNA: { name: 'Nashville International', city: 'Nashville, TN', country: 'US', lat: 36.1245, lon: -86.6782 },
  AUS: { name: 'Austin-Bergstrom International', city: 'Austin, TX', country: 'US', lat: 30.1975, lon: -97.6664 },
  MDW: { name: 'Chicago Midway International', city: 'Chicago, IL', country: 'US', lat: 41.7868, lon: -87.7522 },
  SLC: { name: 'Salt Lake City International', city: 'Salt Lake City, UT', country: 'US', lat: 40.7884, lon: -111.9778 },
  MCI: { name: 'Kansas City International', city: 'Kansas City, MO', country: 'US', lat: 39.2976, lon: -94.7139 },
  RDU: { name: 'Raleigh-Durham International', city: 'Raleigh, NC', country: 'US', lat: 35.8776, lon: -78.7875 },
  HNL: { name: 'Daniel K. Inouye International', city: 'Honolulu, HI', country: 'US', lat: 21.3187, lon: -157.9225 },
  ANC: { name: 'Ted Stevens Anchorage International', city: 'Anchorage, AK', country: 'US', lat: 61.1743, lon: -149.9963 },

  // ── Canada ───────────────────────────────────────────────────────────────
  YYZ: { name: 'Toronto Pearson International', city: 'Toronto, ON', country: 'CA', lat: 43.6777, lon: -79.6248 },
  YVR: { name: 'Vancouver International', city: 'Vancouver, BC', country: 'CA', lat: 49.1947, lon: -123.1839 },
  YUL: { name: 'Montréal-Trudeau International', city: 'Montreal, QC', country: 'CA', lat: 45.4706, lon: -73.7408 },
  YYC: { name: 'Calgary International', city: 'Calgary, AB', country: 'CA', lat: 51.1215, lon: -114.0076 },

  // ── Europe ───────────────────────────────────────────────────────────────
  LHR: { name: 'London Heathrow', city: 'London', country: 'GB', lat: 51.4700, lon: -0.4543 },
  LGW: { name: 'London Gatwick', city: 'London', country: 'GB', lat: 51.1537, lon: -0.1821 },
  CDG: { name: 'Paris Charles de Gaulle', city: 'Paris', country: 'FR', lat: 49.0097, lon: 2.5478 },
  AMS: { name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'NL', lat: 52.3086, lon: 4.7639 },
  FRA: { name: 'Frankfurt Airport', city: 'Frankfurt', country: 'DE', lat: 50.0379, lon: 8.5622 },
  MAD: { name: 'Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'ES', lat: 40.4936, lon: -3.5668 },
  BCN: { name: 'Barcelona-El Prat', city: 'Barcelona', country: 'ES', lat: 41.2971, lon: 2.0785 },
  FCO: { name: 'Leonardo da Vinci–Fiumicino', city: 'Rome', country: 'IT', lat: 41.7999, lon: 12.2462 },
  MXP: { name: 'Milan Malpensa International', city: 'Milan', country: 'IT', lat: 45.6306, lon: 8.7281 },
  MUC: { name: 'Munich Airport', city: 'Munich', country: 'DE', lat: 48.3538, lon: 11.7861 },
  ZUR: { name: 'Zürich Airport', city: 'Zürich', country: 'CH', lat: 47.4647, lon: 8.5492 },
  VIE: { name: 'Vienna International Airport', city: 'Vienna', country: 'AT', lat: 48.1102, lon: 16.5697 },
  BRU: { name: 'Brussels Airport', city: 'Brussels', country: 'BE', lat: 50.9014, lon: 4.4844 },
  CPH: { name: 'Copenhagen Airport', city: 'Copenhagen', country: 'DK', lat: 55.6180, lon: 12.6508 },
  ARN: { name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'SE', lat: 59.6519, lon: 17.9186 },
  OSL: { name: 'Oslo Airport Gardermoen', city: 'Oslo', country: 'NO', lat: 60.1976, lon: 11.1004 },
  HEL: { name: 'Helsinki-Vantaa Airport', city: 'Helsinki', country: 'FI', lat: 60.3183, lon: 24.9630 },
  ATH: { name: 'Athens International', city: 'Athens', country: 'GR', lat: 37.9364, lon: 23.9445 },
  LIS: { name: 'Lisbon Portela Airport', city: 'Lisbon', country: 'PT', lat: 38.7813, lon: -9.1359 },
  DUB: { name: 'Dublin Airport', city: 'Dublin', country: 'IE', lat: 53.4213, lon: -6.2701 },
  EDI: { name: 'Edinburgh Airport', city: 'Edinburgh', country: 'GB', lat: 55.9508, lon: -3.3615 },
  WAW: { name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'PL', lat: 52.1657, lon: 20.9671 },
  PRG: { name: 'Václav Havel Airport Prague', city: 'Prague', country: 'CZ', lat: 50.1008, lon: 14.2600 },
  BUD: { name: 'Budapest Ferenc Liszt International', city: 'Budapest', country: 'HU', lat: 47.4298, lon: 19.2611 },

  // ── Middle East / Africa ─────────────────────────────────────────────────
  DXB: { name: 'Dubai International', city: 'Dubai', country: 'AE', lat: 25.2532, lon: 55.3657 },
  AUH: { name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'AE', lat: 24.4330, lon: 54.6511 },
  DOH: { name: 'Hamad International Airport', city: 'Doha', country: 'QA', lat: 25.2731, lon: 51.6081 },
  IST: { name: 'Istanbul Airport', city: 'Istanbul', country: 'TR', lat: 41.2753, lon: 28.7519 },
  TLV: { name: 'Ben Gurion International', city: 'Tel Aviv', country: 'IL', lat: 32.0114, lon: 34.8867 },
  CAI: { name: 'Cairo International', city: 'Cairo', country: 'EG', lat: 30.1219, lon: 31.4056 },
  JNB: { name: 'O.R. Tambo International', city: 'Johannesburg', country: 'ZA', lat: -26.1392, lon: 28.2460 },
  CPT: { name: 'Cape Town International', city: 'Cape Town', country: 'ZA', lat: -33.9648, lon: 18.6017 },
  NBO: { name: 'Jomo Kenyatta International', city: 'Nairobi', country: 'KE', lat: -1.3192, lon: 36.9275 },
  CMN: { name: 'Mohammed V International', city: 'Casablanca', country: 'MA', lat: 33.3675, lon: -7.5900 },

  // ── Asia ─────────────────────────────────────────────────────────────────
  HND: { name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'JP', lat: 35.5494, lon: 139.7798 },
  NRT: { name: 'Narita International', city: 'Tokyo', country: 'JP', lat: 35.7720, lon: 140.3929 },
  PEK: { name: 'Beijing Capital International', city: 'Beijing', country: 'CN', lat: 40.0799, lon: 116.6031 },
  PKX: { name: 'Beijing Daxing International', city: 'Beijing', country: 'CN', lat: 39.5095, lon: 116.4105 },
  PVG: { name: 'Shanghai Pudong International', city: 'Shanghai', country: 'CN', lat: 31.1443, lon: 121.8083 },
  HKG: { name: 'Hong Kong International', city: 'Hong Kong', country: 'HK', lat: 22.3080, lon: 113.9185 },
  ICN: { name: 'Incheon International', city: 'Seoul', country: 'KR', lat: 37.4691, lon: 126.4510 },
  SIN: { name: 'Singapore Changi Airport', city: 'Singapore', country: 'SG', lat: 1.3644, lon: 103.9915 },
  BKK: { name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'TH', lat: 13.6900, lon: 100.7501 },
  KUL: { name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'MY', lat: 2.7456, lon: 101.7099 },
  CGK: { name: 'Soekarno-Hatta International', city: 'Jakarta', country: 'ID', lat: -6.1256, lon: 106.6559 },
  MNL: { name: 'Ninoy Aquino International', city: 'Manila', country: 'PH', lat: 14.5086, lon: 121.0197 },
  DEL: { name: 'Indira Gandhi International', city: 'New Delhi', country: 'IN', lat: 28.5562, lon: 77.1000 },
  BOM: { name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'IN', lat: 19.0896, lon: 72.8656 },
  MAA: { name: 'Chennai International', city: 'Chennai', country: 'IN', lat: 12.9900, lon: 80.1693 },
  BLR: { name: 'Kempegowda International', city: 'Bangalore', country: 'IN', lat: 13.1979, lon: 77.7063 },

  // ── Australia / Pacific ──────────────────────────────────────────────────
  SYD: { name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'AU', lat: -33.9399, lon: 151.1753 },
  MEL: { name: 'Melbourne Airport', city: 'Melbourne', country: 'AU', lat: -37.6690, lon: 144.8410 },
  BNE: { name: 'Brisbane Airport', city: 'Brisbane', country: 'AU', lat: -27.3842, lon: 153.1175 },
  PER: { name: 'Perth Airport', city: 'Perth', country: 'AU', lat: -31.9403, lon: 115.9669 },
  AKL: { name: 'Auckland Airport', city: 'Auckland', country: 'NZ', lat: -37.0082, lon: 174.7850 },
  NAN: { name: 'Nadi International', city: 'Nadi', country: 'FJ', lat: -17.7553, lon: 177.4431 },

  // ── Latin America ────────────────────────────────────────────────────────
  GRU: { name: 'São Paulo-Guarulhos International', city: 'São Paulo', country: 'BR', lat: -23.4356, lon: -46.4731 },
  GIG: { name: 'Rio de Janeiro–Galeão International', city: 'Rio de Janeiro', country: 'BR', lat: -22.8100, lon: -43.2506 },
  EZE: { name: 'Ministro Pistarini International', city: 'Buenos Aires', country: 'AR', lat: -34.8222, lon: -58.5358 },
  SCL: { name: 'Arturo Merino Benítez International', city: 'Santiago', country: 'CL', lat: -33.3930, lon: -70.7858 },
  BOG: { name: 'El Dorado International', city: 'Bogotá', country: 'CO', lat: 4.7016, lon: -74.1469 },
  LIM: { name: 'Jorge Chávez International', city: 'Lima', country: 'PE', lat: -12.0219, lon: -77.1143 },
  MEX: { name: 'Felipe Ángeles International', city: 'Mexico City', country: 'MX', lat: 19.4363, lon: -99.0721 },
  CUN: { name: 'Cancún International', city: 'Cancún', country: 'MX', lat: 21.0365, lon: -86.8771 },
}

/**
 * Look up an airport by IATA code (case-insensitive).
 * @returns {object|null} airport data or null if not found
 */
export function lookupAirport(iata) {
  if (!iata) return null
  return AIRPORTS[iata.trim().toUpperCase()] || null
}
