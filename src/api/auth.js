import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';


export const signup = (data) =>
  axios.post(`${API_BASE_URL}/user/signup`, data);


export const login = (data) =>
  axios.post(`${API_BASE_URL}/user/login`, data);


export const forgotPassword = (email) =>
  axios.post(`${API_BASE_URL}/user/forgot-password`, JSON.stringify(email), {
    headers: { "Content-Type": "application/json" }
  });


export const resendOtp = (email) =>
  axios.post(`${API_BASE_URL}/user/resend-otp`, JSON.stringify(email), {
    headers: { "Content-Type": "application/json" }
  });


export const resetPassword = (data) =>
  axios.post(`${API_BASE_URL}/user/reset-password`, data);
