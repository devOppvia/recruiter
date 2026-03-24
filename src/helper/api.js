import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const IMG_URL = import.meta.env.VITE_IMG_URL;
// export const COMPANY_ID = JSON.parse(localStorage.getItem("userData")) || "";
export const COMPANY_ID =
  JSON.parse(localStorage.getItem("userData") || "{}")?.id || "";

const api = axios.create({ baseURL: BASE_URL, withCredentials: true });
const addressApi = axios.create({ baseURL: BASE_URL, withCredentials: true });

const getAccessToken = () => {
  return localStorage.getItem("token");
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data.data.accessToken;
        if (newAccessToken) {
          localStorage.setItem("token", newAccessToken);
          api.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);

addressApi.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const getCompanyDetailsApi = async (companyId) => {
  try {
    const response = await api.get(`/company/get-company-details/${companyId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || "Check Network Connection";
  }
};

export const getJobData = async (userData) => {
  try {
    const response = await api.post("jobs/get-jobs", userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const createJobOpeningApi = async (userData) => {
  try {
    const response = await api.post("jobs/submit-job-opening", userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getJobCategoriesApi = async () => {
  try {
    const response = await api.get("job-category/get-categories");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getJobSubCategoriesApi = async (payloadData) => {
  try {
    const response = await api.post(
      `job-subCategory/get-subCategories`,
      payloadData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getSkillsApi = async (payloadData) => {
  try {
    const response = await api.post(`skills/get-skills`, payloadData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getViewJobcardApi = async (jobId) => {
  try {
    const response = await api.get(`jobs/get-job-details/${jobId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const deleteJobPostApi = async (jobId) => {
  try {
    const response = await api.delete(`jobs/delete-job/${jobId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const updateJobStatusApi = async (jobId, jobStatus) => {
  try {
    const response = await api.put(
      `jobs/update-job-status/${jobId}`,
      jobStatus,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const editJobApi = async (jobId, jobData) => {
  try {
    const response = await api.put(`jobs/update-job-details/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getCandidatesDataApi = async (userData) => {
  try {
    const response = await api.post("candidate/get-candidates", userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const resumeDownloadApi = async (candidateId) => {
  try {
    const response = await api.get(`candidate/download-resume/${candidateId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const updateCandidateStatusApi = async (
  candidateId,
  candidateStatus,
) => {
  try {
    const response = await api.put(
      `candidate/update-status/${candidateId}`,
      candidateStatus,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const deleteCandidatePostApi = async (candidateId) => {
  try {
    const response = await api.delete(
      `candidate/delete-candidate/${candidateId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getViewProfileInfoApi = async (candidateId) => {
  try {
    const response = await api.get(
      `candidate/get-candidate-details/${candidateId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Resume Bank

export const getResumeBankApi = async (userData) => {
  try {
    const response = await api.post("resume-bank/get-interns", userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const resumeBankDownload = async (candidateId, companyId) => {
  try {
    const response = await api.post(
      `resume-bank/download-resume/${candidateId}`,
      companyId,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getDownloadedResumesApi = async (companyId, userData) => {
  try {
    const response = await api.post(
      `resume-bank/get-downloaded-resumes/${companyId}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const deleteDownloadedResumesApi = async (resumeId) => {
  try {
    const response = await api.delete(`resume-bank/delete-resume/${resumeId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const updateDownloadedResumeApi = async (resumeId, resumeStatus) => {
  try {
    const response = await api.put(
      `resume-bank/update-status/${resumeId}`,
      resumeStatus,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const downloadResumeFreeApi = async (userData) => {
  try {
    const response = await api.post(`resume-bank/download-resume`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const createSupportApi = async (supportData) => {
  try {
    const response = await api.post(`support/create-support`, supportData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getjobLocationsApi = async (companyId) => {
  try {
    const response = await api.get(`jobs/get-company-locations/${companyId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getFilterJobCategoriesApi = async (userData) => {
  try {
    const response = await api.post(
      `job-category/get-job-categories-for-filter`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getFilterJobSubCategoriesApi = async (userData) => {
  try {
    const response = await api.post(
      `job-subCategory/get-jobSubCategories-for-filter`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Dashboard

export const getDashboardInfoApi = async (userData) => {
  try {
    const response = await api.post(
      `company-dashboard/get-dashboard-details`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getDashboardJobStatusApi = async (userData) => {
  try {
    const response = await api.post(
      `company-dashboard/job-status/get-dashboard-details`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getDashboardCandidatChartApi = async (userData) => {
  try {
    const response = await api.post(
      `company-dashboard/candidate/get-dashboard-details`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getDashboardJobCountByStatusApi = async (userData) => {
  try {
    const response = await api.post(
      `company-dashboard/job-count/get-dashboard-details`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getDashboardCandidatDetailsApi = async (userData) => {
  try {
    const response = await api.post(
      `company-dashboard/candidate-details/get-dashboard-details`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};
export const getDashboardInterviewsApi = async (userData) => {
  try {
    const response = await api.post(
      `company-dashboard/interviews/get-all-interviews`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getDashboardCreditsAndStatsApi = async (userData) => {
  try {
    const response = await api.post(
      `company-dashboard/credits-and-stats/get-dashboard-details`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getCandidateCardApi = async (userData) => {
  try {
    const response = await api.post(
      `company-dashboard/candidate-details/get-dashboard-details`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//AI powered about

export const getAiGeneratedAboutApi = async (userData) => {
  try {
    const response = await api.post(`jobs/generate-job-about`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getAiGeneratedOtherDetailsApi = async (userData) => {
  try {
    const response = await api.post(`jobs/generate-job-other-requirements`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Support

export const getAllSupportApi = async (userData) => {
  try {
    const response = await api.post(
      `support/company/get-all-supports`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Support Message

export const getAllSupportMessagesApi = async (userData) => {
  try {
    const response = await api.post(`support/get-support-messages`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Add Support Message

export const addSupportMessageApi = async (userData) => {
  try {
    const response = await api.post(`support/add-support-message`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Get Location API (Resume Filter)

export const getLocationApi = async () => {
  try {
    const response = await api.get(`resume-bank/get-intern-cities`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Get-Intern-Industries (Resume Filter)

export const getInternIndustriesApi = async () => {
  try {
    const response = await api.get(`resume-bank/get-intern-industries`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getInternDepartmentsApi = async (industryId) => {
  try {
    const response = await api.get(
      `resume-bank/get-intern-departments/${industryId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Profile Management

export const getCompanyProfileDetailsApi = async (companyId) => {
  try {
    const response = await api.get(`company/get-company-detail/${companyId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Edit Profile

export const editProfileApi = async (userData, companyId) => {
  try {
    const response = await api.put(
      `company/update-company-profile/${companyId}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Get All Industries

export const getIndustriesListApi = async () => {
  try {
    const response = await api.get(`/company/get-industries`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const companySignInApi = async (userData) => {
  try {
    const response = await api.post(`company-auth/login`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const companyCreateAccountApi = async (userData) => {
  try {
    const response = await api.post(
      `company-auth/registration-step1`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const companyCreateAccountStep2Api = async (userData) => {
  try {
    const response = await api.post(
      `company-auth/registration-step2`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const companyCreateAccountStep3Api = async (userData) => {
  try {
    const response = await api.post(
      `company-auth/registration-step3`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const companyCreateAccountStep4Api = async (userData) => {
  try {
    const response = await api.post(
      `company-auth/registration-step4`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const sendForgotPasswordMailApi = async (body) => {
  try {
    let response = await api.post("/company-auth/forgot-password", body);
    return response.data;
  } catch (error) {
    console.log("Error ::", error);
    return error?.response?.data || "Check Network Connection";
  }
};
export const resetPasswordApi = async (body) => {
  try {
    let response = await api.post("/company-auth/reset-password", body);
    return response.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || "Check Network Connection";
  }
};

export const subscriptionApi = async (body) => {
  try {
    let response = await api.post(
      "subscription/company/proceed-to-checkout",
      body,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || "Check Network Connection";
  }
};

export const subscriptionVerifyPaymentApi = async (body) => {
  try {
    let response = await api.post("subscription/company/verify-payment", body);
    return response.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || "Check Network Connection";
  }
};

//Get Notifications
export const getNotificationsApi = async (companyId) => {
  try {
    const response = await api.get(`notification/${companyId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getCurrentCompanyStatus = async (companyId) => {
  try {
    const response = await api.get(`company-auth/${companyId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Get Subscription Credits

export const getSubscriptionPackagesApi = async (companyId) => {
  try {
    const response = await api.get(
      `subscription/company/get-subscription-packages/${companyId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Get Purchased Subscription API

export const getPurchasedSubscriptionsApi = async (companyId) => {
  try {
    const response = await api.get(
      `subscription/company/get-purchased-subscriptions/${companyId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Create Job POST (Select Plan)

export const getPurchasedPlanApi = async (companyId) => {
  try {
    const response = await api.get(
      `subscription/company/get-packages-job-post/${companyId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getPaymentHistoryApi = async (companyId) => {
  try {
    const response = await api.get(
      `subscription/company/payment-history/${companyId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Verify Company Mobile Num OTP

export const verifyCompanyMobileNumOtpApi = async (companyId, payloadData) => {
  try {
    const response = await api.post(
      `company-auth/verify-company-mobile-otp/${companyId}`,
      payloadData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Resend Mobile Num OTP

export const resendCompanyMobileNumOtpApi = async (companyId, payloadData) => {
  try {
    const response = await api.post(
      `company-auth/resend-company-mobile-otp/${companyId}`,
      payloadData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Verify Company Email OTP

export const verifyCompanyEmailOtpApi = async (companyId, payloadData) => {
  try {
    const response = await api.post(
      `company-auth/verify-company-email-otp/${companyId}`,
      payloadData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Resend Company Email OTP

export const resendCompanyEmailOtpApi = async (companyId, payloadData) => {
  try {
    const response = await api.post(
      `company-auth/resend-company-email-otp/${companyId}`,
      payloadData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Email

//Step 1: Sending Email to old otp

export const updateCompanyEmailWithOTP = async (companyId, userData) => {
  try {
    const response = await api.post(
      `company-auth/update-company-email-otp/${companyId}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Step 2: Verify Old email with otp

export const verifyCompanyEmailWithOTP = async (companyId, userData) => {
  try {
    const response = await api.post(
      `company-auth/verify-company-email-otp/${companyId}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

// Step 3: Send OTP To New Email

export const sendCompanyNewEmailOtp = async (companyId, userData) => {
  try {
    const response = await api.post(
      `company-auth/send-company-new-email-otp/${companyId}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

// Step 4: Verify and Update New Email id with otp

export const verifyAndUpdateNewMailWithOtpApi = async (companyId, userData) => {
  try {
    const response = await api.post(
      `company-auth/verify-otp-and-update-email/${companyId}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Mobile

//Step 1: Sending otp to old mobile

export const updateComapanyMobileWithOTP = async (companyId, userData) => {
  try {
    const response = await api.post(
      `company-auth/update-company-mobile-otp/${companyId}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Step 2: Verify Old mobile with otp

export const verifyCompanyMobileWithOTP = async (companyId, userData) => {
  try {
    const response = await api.post(
      `company-auth/verify-company-old-mobile-otp/${companyId}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

// Step 3: Send OTP To New Email

export const sendCompanyNewMobileOtp = async (companyId, userData) => {
  try {
    const response = await api.post(
      `company-auth/send-company-new-mobile-otp/${companyId}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

// Step 4: Verify and Update New Email id with otp

export const verifyAndUpdateNewMobileWithOtpApi = async (
  companyId,
  userData,
) => {
  try {
    const response = await api.post(
      `company-auth/verify-otp-and-update-mobile/${companyId}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Change candiate status from shortlisted to Interview

export const scheduleInterviewApi = async (payloadData) => {
  try {
    const response = await api.post(`interview/schedule`, payloadData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const generateJobPositionTitleApi = async (payloadData) => {
  try {
    const response = await api.post(`jobs/generate-role-title`, payloadData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export { api, addressApi };
