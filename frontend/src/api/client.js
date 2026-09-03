import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';



const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer token to all requests
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const api = {
  // Auth
  signup: (data) => client.post('/auth/signup', data),
  login: (data) => client.post('/auth/login', data),
  getMe: () => client.get('/auth/me'),
  updateMe: (data) => client.put('/auth/me', data),

  // Locations
  getStates: () => client.get('/locations/states'),
  getDistricts: (state) => client.get(`/locations/districts?state=${encodeURIComponent(state)}`),
  getBlocks: (state, district) => client.get(`/locations/blocks?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`),
  getVillages: (state, district, block) => client.get(`/locations/villages?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}&block=${encodeURIComponent(block)}`),
  getVillageById: (id) => client.get(`/locations/villages/${id}`),

  // Business Models
  getBusinessModels: () => client.get('/business-models'),
  getBusinessModelCategory: (category) => client.get(`/business-models/${category}`),

  // Assessments
  createAssessment: (data) => client.post('/assessments', data),
  updateAssessment: (id, data) => client.put(`/assessments/${id}`, data),
  getAssessment: (id) => client.get(`/assessments/${id}`),
  runAssessment: (id) => client.post(`/assessments/${id}/run`),
  listAssessments: () => client.get('/assessments'),
  getReport: (id, lang = 'en') => client.get(`/assessments/${id}/report?lang=${lang}`),
  getMarketMap: (id) => client.get(`/assessments/${id}/market-map`),
  getAlternatives: (id, lang = 'en') => client.get(`/assessments/${id}/alternatives?lang=${lang}`),
  getImprovementPlan: (id, lang = 'en') => client.get(`/assessments/${id}/improvement-plan?lang=${lang}`),
  updateImprovementAction: (id, actionId, status) => client.put(`/assessments/${id}/improvement-plan/${actionId}`, { status }),
  getFinancialPlan: (id, lang = 'en') => client.get(`/assessments/${id}/financial-plan?lang=${lang}`),
  getAssessmentLegalOffices: (id) => client.get(`/assessments/${id}/legal-offices`),


  // Legal Offices & Checklists
  getLegalOffices: (district) => client.get(`/legal-offices?district=${encodeURIComponent(district || '')}`),
  getDocumentChecklist: (category) => client.get(`/legal-offices/document-checklist?category=${category}`),

  // Speech Transcription
  transcribeSpeech: (formData) => client.post('/speech/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export default api;
