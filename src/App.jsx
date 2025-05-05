import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/header";
import Intro from "./components/Intro";
import KeyFeature from "./components/KeyFeature";
//import Questions from "./components/questionnaire";
import HowItWorks from "./components/howItwork";
import CallToAction from "./components/callToAction";
import Footer from "./components/Footer";
import Questionnaire from "./components/questionnaire";


import SignUp from "./pages/signin/SignUp";
import Login from "./pages/signin/login";
import Forgot from "./pages/signin/forgot";
import ResetPassword from "./pages/signin/resetpassword";
import ResetSuccessfully from "./pages/signin/resetsuccesfully";
import OTPVerification from "./pages/signin/otpverification";
import AdminLogin from "./pages/admin/adminlogin";

import AdminDashboard from "./pages/admin/admindashboard";
import CreateQuestion from "./pages/admin/adminscreens/createQuestion";
import GetQuestions from "./pages/admin/adminscreens/GetQuestions";
import GenerateReport from "./pages/admin/adminscreens/GenerateReport";
import GenerateFeedback from "./pages/admin/adminscreens/GenerateFeedback";
import CompanyManagement from "./pages/admin/adminscreens/companymanagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        
        <Route
          path="/home"
          element={
            <>
              <Header />
              <main className="bg-white text-black min-h-screen">
                <Intro />
                <KeyFeature />
                <HowItWorks />
                <CallToAction />
              </main>
              <Footer />
            </>
          }
        />
<Route path="/questionnaire" element={<Questionnaire />} />

        {/* Auth Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/resetsuccess" element={<ResetSuccessfully />} />
        <Route path="/otpverification" element={<OTPVerification />} />
        <Route path="/admin-login" element={<AdminLogin />} />


        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route path="create-question" element={<CreateQuestion />} />
          <Route path="get-questions" element={<GetQuestions />} />
          <Route path="/admin/dashboard/company" element={<CompanyManagement />} />
          <Route path="generate-report" element={<GenerateReport />} />
          <Route path="feedback" element={<GenerateFeedback />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
