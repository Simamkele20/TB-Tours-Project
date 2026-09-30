const apiUrl = (typeof window !== 'undefined' && (window as any).__env?.apiUrl) || 
               (typeof process !== 'undefined' && process.env['NG_APP_API_URL']) || 
               "http://localhost:4000/api";

export const environment = {
  production: false,
  apiUrl: apiUrl,
  apiBaseUrl: apiUrl,
  // ⚠️  TEST KEY ONLY - Use for development/testing only
  // Replace with pk_live_xxx in production
  paystackPublicKey: "pk_test_39961bd3d5a124c5636be980de3a124489f922d5",
  maintenanceMode: false,
  useMockData: false
};
