import axios from 'axios';

import API_BASE_URL from '../constants/config';


export const signup = (data) =>
  axios.post(`${API_BASE_URL}/user/signup`, data);


export const login = (data) =>
  axios.post(`${API_BASE_URL}/user/login`, data);



export const forgotPassword = (data) => {
  return axios.post(`${API_BASE_URL}/user/forgot-password`, data); 
};

export const verifyOtp = (data) => {
  return axios.post(`${API_BASE_URL}/user/verify-otp`, data);
};


export const resendOtp = (email) =>
  axios.post(`${API_BASE_URL}/user/resend-otp`, JSON.stringify(email), {
    headers: { "Content-Type": "application/json" }
  });


export const resetPassword = (data) =>
  axios.post(`${API_BASE_URL}/user/reset-password`, data);
