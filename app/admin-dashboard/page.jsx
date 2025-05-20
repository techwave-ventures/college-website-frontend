// app/admin-dashboard/page.jsx
// This is a Client Component implementing the form AND client-side auth check.

"use client"; // Required for components using hooks like useState, useEffect

import { useState, useEffect } from "react";
import axios from "axios"; // For making HTTP requests
import toast, { Toaster } from 'react-hot-toast'; // Import toast
import { useRouter } from "next/navigation"; // Use 'next/navigation' for App Router redirects

// Import UI components (assuming shadcn/ui setup)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react"; // Import Loader2 for loading indicator
// import { Separator } from "@/components/ui/separator"; // For visual separation

// Define the API base URL for your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://college-website-backend-main-z0vm.onrender.com/apiv1";
const LOGIN_URL = '/auth/login';
const UNAUTHORIZED_REDIRECT_URL = '/'; // Where non-admins are sent

// --- Initial State Definition (remains the same) ---
const initialCourseState = {
  name: "",
  duration: "",
  branches: [{ bName: "", cutOffs: [{ name: "", image: "" }] }],
  fees: [{ category: "", amt: "" }],
  placements: { averageSalary: "", highestSalary: "" },
};

const initialFormData = {
  examId: "",
  data: {
    name: "",
    avatarImage: "", // Store ObjectId as string or null
    description: "",
    images: [], // Store array of ObjectIds as strings
    dteCode: "",
    location: "",
    year: "",
    affiliation: "",
    type: "",
    admissionProcess: "",
    infrastructure: "", // Keep as string for input, split on submit
    review: "", // Single review string
    // placement: "", // Overall college placement ID (optional to handle here)
    courses: [initialCourseState], // Start with one empty course
  },
};


// --- The Main Component ---
export default function AdminDashboardClientPage() {
  const router = useRouter();

  // --- State Variables ---
  const [authStatus, setAuthStatus] = useState({ isLoading: true, isAdmin: false, isAuthenticated: false }); // Combined auth state
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [collegesInExam, setCollegesInExam] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [isLoadingExams, setIsLoadingExams] = useState(false); // Specific loading states
  const [isFetchingColleges, setIsFetchingColleges] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const isUpdateMode = !!selectedCollegeId;

  // --- Effect for Authentication and Authorization Check ---
  useEffect(() => {
    const checkAdminStatus = async () => {
      setAuthStatus({ isLoading: true, isAdmin: false, isAuthenticated: false }); // Start loading
      // Use the same profile endpoint your Navbar uses
      const profileUrl = `${API_BASE_URL}/users/getUserProfile`;

      console.log("[Admin Client Page] Checking auth status from:", profileUrl);

      try {
        // Make the API call to check the user's status and role
        const response = await axios.get(profileUrl, { withCredentials: true });

        if (response.data && response.data.success && response.data.user) {
          const user = response.data.user;
          console.log("[Admin Client Page] User data received:", user);
          // Check if the user's accountType is 'Admin'
          if (user.accountType === 'Admin') {
            console.log("[Admin Client Page] User is Admin. Granting access.");
            setAuthStatus({ isLoading: false, isAdmin: true, isAuthenticated: true });
            // Proceed to load form data if needed (handled by other useEffects)
          } else {
            // User is logged in but not an Admin
            console.warn("[Admin Client Page] User is authenticated but NOT Admin. Redirecting.");
            setAuthStatus({ isLoading: false, isAdmin: false, isAuthenticated: true });
            toast.error("Access Denied: Admin privileges required.");
            router.replace(UNAUTHORIZED_REDIRECT_URL); // Redirect non-admins away (e.g., to home)
          }
        } else {
          // Handle cases where backend response is successful but data format is wrong or indicates not logged in
           console.warn("[Admin Client Page] User not authenticated or invalid response format. Redirecting to login.");
           setAuthStatus({ isLoading: false, isAdmin: false, isAuthenticated: false });
           const redirectUrl = `${LOGIN_URL}?redirectedFrom=/admin-dashboard&error=session_expired`;
           router.replace(redirectUrl);
        }
      } catch (error) {
        // Handle errors during the API call (e.g., 401 Unauthorized, network error)
        console.error("[Admin Client Page] Failed to fetch user status:", error.response?.data || error.message);
        setAuthStatus({ isLoading: false, isAdmin: false, isAuthenticated: false });
        // Redirect to login on any auth error
        const redirectUrl = `${LOGIN_URL}?redirectedFrom=/admin-dashboard&error=session_expired`;
        toast.error("Authentication required. Please log in.");
        router.replace(redirectUrl);
      }
    };

    checkAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run this check only once when the component mounts

  // --- Effects for Form Data Loading (Exams, Colleges, Details) ---
  // These effects depend on the auth check completing successfully for an admin
  useEffect(() => {
    // Only fetch exams if the user is confirmed as admin and auth check is done
    if (!authStatus.isLoading && authStatus.isAdmin) {
        const fetchExams = async () => {
          setIsLoadingExams(true);
          try {
            // Include credentials for potentially protected exam endpoint
            const res = await axios.get(`${API_BASE_URL}/exam`, { withCredentials: true });
            setExams(res.data.exams || []);
          } catch (fetchError) {
            console.error("Error fetching exams:", fetchError);
            toast.error("Failed to load exams.");
            setExams([]);
          } finally {
            setIsLoadingExams(false);
          }
        };
        fetchExams();
    }
    // Intentionally disable exhaustive-deps for this effect if fetchExams isn't memoized
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus.isLoading, authStatus.isAdmin]); // Depend on auth status

  useEffect(() => {
    // Don't fetch colleges if no exam is selected or if user isn't admin
    if (!selectedExamId || !authStatus.isAdmin) {
      setCollegesInExam([]);
      setSelectedCollegeId(""); // Also reset college ID if exam changes
      // Keep examId in form state if it was set
      setFormData(prev => ({ ...initialFormData, examId: prev.examId || "" }));
      return;
    }

    const fetchCollegesForExam = async () => {
      setIsFetchingColleges(true);
      setSelectedCollegeId(""); // Reset college selection when exam changes
      setFormData(prev => ({ ...initialFormData, examId: selectedExamId })); // Reset form, set new examId
      try {
        const res = await axios.get(`${API_BASE_URL}/exam/${selectedExamId}`, { withCredentials: true });
        const collegesData = res.data.exam?.colleges?.map(college => ({
          id: college._id,
          name: college.name,
        })) || [];
        setCollegesInExam(collegesData);
        if (collegesData.length === 0) {
          toast("No colleges found for the selected exam.", { icon: 'ℹ️' });
        }
      } catch (error) {
        console.error("Error fetching colleges for exam:", error);
        toast.error("Failed to load colleges for the selected exam.");
        setCollegesInExam([]);
      } finally {
        setIsFetchingColleges(false);
      }
    };

    fetchCollegesForExam();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExamId, authStatus.isAdmin]); // Depend on selectedExamId and admin status

  useEffect(() => {
    // Don't fetch details if no college is selected or user isn't admin
    if (!selectedCollegeId || !authStatus.isAdmin) {
      // Reset only the data part of the form if college ID is cleared, keep examId
      setFormData(prev => ({ ...initialFormData, examId: prev.examId }));
      return;
    }

    const fetchCollegeDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/college/${selectedCollegeId}`, { withCredentials: true });
        const collegeData = res.data.college;

        if (!collegeData) {
            toast.error("College data not found.");
            setSelectedCollegeId(""); // Reset selection
            return;
        }
        // Map fetched data (same detailed mapping as before)
        setFormData({
            examId: selectedExamId, // Keep current exam ID
            data: {
              name: collegeData.name || "",
              avatarImage: collegeData.avatarImage?._id || "",
              description: collegeData.description || "",
              images: collegeData.images?.map(img => img._id).filter(Boolean) || [],
              dteCode: collegeData.dteCode || "",
              location: collegeData.location || "",
              year: collegeData.year || "",
              affiliation: collegeData.affiliation || "",
              type: collegeData.type || "",
              admissionProcess: collegeData.admissionProcess || "",
              infrastructure: Array.isArray(collegeData.infrastructure) ? collegeData.infrastructure.join(", ") : (collegeData.infrastructure || ""),
              review: collegeData.review || "",
              courses: (collegeData.courses?.length > 0 ? collegeData.courses : [initialCourseState]).map(course => ({
                name: course.name || "",
                duration: course.duration || "",
                branches: (course.branches?.length > 0 ? course.branches : [{ bName: "", cutOffs: [{ name: "", image: "" }] }]).map(branch => ({
                  bName: branch.bName || "",
                  cutOffs: (branch.cutOffs?.length > 0 ? branch.cutOffs : [{ name: "", image: "" }]).map(cutoff => ({
                    name: cutoff.name || "",
                    image: cutoff.image?._id || "",
                  })),
                })),
                fees: (course.fees?.length > 0 ? course.fees : [{ category: "", amt: "" }]).map(fee => ({
                  category: fee.category || "",
                  amt: fee.amt || "",
                })),
                placements: {
                  averageSalary: course.placement?.averageSalary || "",
                  highestSalary: course.placement?.highestSalary || "",
                },
              })),
            },
          });
        toast.success(`Loaded data for ${collegeData.name}`);
      } catch (error) {
        console.error("Error fetching college details:", error);
        toast.error("Failed to load college details.");
        setSelectedCollegeId(""); // Reset selection on error
        setFormData(prev => ({ ...initialFormData, examId: prev.examId })); // Reset form data
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchCollegeDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCollegeId, authStatus.isAdmin]); // Depend on selectedCollegeId and admin status


  // --- State Update Handlers (handleNestedChange, handleChange) ---
  // (These functions remain exactly the same)
  const handleNestedChange = (path, value) => {
     setFormData((prev) => {
       const keys = path.split(".");
       let current = JSON.parse(JSON.stringify(prev));
       let objRef = current;
       for (let i = 0; i < keys.length - 1; i++) {
         const key = keys[i];
         const nextKey = keys[i + 1];
         const isNextKeyIndex = /^\d+$/.test(nextKey);
         if (objRef[key] === undefined || objRef[key] === null) {
             objRef[key] = isNextKeyIndex ? [] : {};
         }
         if (isNextKeyIndex && !Array.isArray(objRef[key])) {
             console.warn(`Path conflict: Trying to access index '${nextKey}' on a non-array at path '${keys.slice(0, i + 1).join('.')}'. Resetting segment.`);
             objRef[key] = [];
         } else if (!isNextKeyIndex && typeof objRef[key] !== 'object') {
              console.warn(`Path conflict: Trying to access key '${nextKey}' on a non-object at path '${keys.slice(0, i + 1).join('.')}'. Resetting segment.`);
              objRef[key] = {};
         }
         objRef = objRef[key];
       }
       objRef[keys[keys.length - 1]] = value;
       return current;
     });
   };
  const handleChange = (e, path) => {
    handleNestedChange(path, e.target.value);
  };


  // --- Image Upload Logic (uploadImage, handleAvatarUpload, etc.) ---
  // (These functions remain exactly the same)
  const uploadImage = async (file) => {
    if (!file) return null;
    const loadingToastId = toast.loading(`Uploading ${file.name}...`);
    const formPayload = new FormData();
    formPayload.append("file", file);
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
      const res = await axios.post(`${API_BASE_URL}/image`, formPayload, config);
      toast.success(`${file.name} uploaded successfully!`, { id: loadingToastId });
      return res.data.image?._id || null;
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      const errorMsg = uploadError.response?.data?.message || uploadError.message;
      if (uploadError.response?.status === 401 || uploadError.response?.status === 403) {
          toast.error(`Authentication error uploading ${file.name}. Please log in again.`, { id: loadingToastId });
      } else {
          toast.error(`Failed to upload ${file.name}: ${errorMsg}`, { id: loadingToastId });
      }
      return null;
    }
  };
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const id = await uploadImage(file); if (id) { handleNestedChange("data.avatarImage", id); }
     e.target.value = null;
  };
  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []); if (files.length === 0) return;
    const ids = await Promise.all(files.map((file) => uploadImage(file)));
    const validIds = ids.filter((id) => id !== null);
    if (validIds.length > 0) { handleNestedChange("data.images", [...(formData.data.images || []), ...validIds]); }
    e.target.value = null;
  };
  const handleCutoffImageUpload = async (e, path) => {
    const file = e.target.files?.[0]; if (!file) return;
    const imageId = await uploadImage(file); if (imageId) { handleNestedChange(path, imageId); }
    e.target.value = null;
  };


  // --- Dynamic Array Management (addCourse, removeCourse, etc.) ---
  // (These functions remain exactly the same)
   const addCourse = () => {
    const currentCourses = formData.data.courses || [];
    handleNestedChange("data.courses", [...currentCourses, JSON.parse(JSON.stringify(initialCourseState))]);
  };
  const removeCourse = (courseIndex) => { handleNestedChange("data.courses", formData.data.courses.filter((_, index) => index !== courseIndex)); }
  const addBranch = (courseIndex) => {
    const newBranch = { bName: "", cutOffs: [{ name: "", image: "" }] };
    const currentBranches = formData.data.courses?.[courseIndex]?.branches || [];
    handleNestedChange(`data.courses.${courseIndex}.branches`, [...currentBranches, newBranch]);
  };
  const removeBranch = (courseIndex, branchIndex) => { const currentBranches = formData.data.courses?.[courseIndex]?.branches || []; handleNestedChange(`data.courses.${courseIndex}.branches`, currentBranches.filter((_, index) => index !== branchIndex)); }
  const addCutoff = (courseIndex, branchIndex) => {
    const newCutoff = { name: "", image: "" };
    const currentCutoffs = formData.data.courses?.[courseIndex]?.branches?.[branchIndex]?.cutOffs || [];
    handleNestedChange(`data.courses.${courseIndex}.branches.${branchIndex}.cutOffs`, [...currentCutoffs, newCutoff]);
  };
  const removeCutoff = (courseIndex, branchIndex, cutoffIndex) => { const currentCutoffs = formData.data.courses?.[courseIndex]?.branches?.[branchIndex]?.cutOffs || []; handleNestedChange(`data.courses.${courseIndex}.branches.${branchIndex}.cutOffs`, currentCutoffs.filter((_, index) => index !== cutoffIndex)); }
  const addFee = (courseIndex) => {
     const newFee = { category: "", amt: "" };
     const currentFees = formData.data.courses?.[courseIndex]?.fees || [];
     handleNestedChange(`data.courses.${courseIndex}.fees`, [...currentFees, newFee]);
   };
   const removeFee = (courseIndex, feeIndex) => { const currentFees = formData.data.courses?.[courseIndex]?.fees || []; handleNestedChange(`data.courses.${courseIndex}.fees`, currentFees.filter((_, index) => index !== feeIndex)); }


  // --- Form Submission (handleSubmit) ---
  // (This function remains exactly the same)
   const handleSubmit = async () => {
    setIsSubmitting(true);
    toast.loading(isUpdateMode ? 'Updating college...' : 'Creating college...', { id: 'submit-toast' });
    // Validation
    if (!selectedExamId && !isUpdateMode) { toast.error("Please select an exam.", { id: 'submit-toast' }); setIsSubmitting(false); return; }
     if (!formData.data.name || !formData.data.dteCode) { toast.error("College Name and DTE Code are required.", { id: 'submit-toast' }); setIsSubmitting(false); return; }
    // Data Prep
    const submissionData = JSON.parse(JSON.stringify(formData.data));
    submissionData.infrastructure = submissionData.infrastructure ? submissionData.infrastructure.split(',').map(item => item.trim()).filter(Boolean) : [];
    submissionData.dteCode = Number(submissionData.dteCode) || 0;
    submissionData.year = Number(submissionData.year) || null;
    submissionData.courses = submissionData.courses.map(course => ({ ...course, fees: course.fees.map(fee => ({ ...fee, amt: Number(fee.amt) || 0 })), placements: { averageSalary: Number(course.placements.averageSalary) || 0, highestSalary: Number(course.placements.highestSalary) || 0, } }));
    // API Call
    const payload = isUpdateMode ? { data: submissionData } : { examId: selectedExamId, data: submissionData };
    const url = isUpdateMode ? `${API_BASE_URL}/college/${selectedCollegeId}` : `${API_BASE_URL}/college`;
    const method = isUpdateMode ? 'put' : 'post';
    console.log(`Submitting (${method.toUpperCase()}) to ${url}:`, JSON.stringify(payload, null, 2));
    try {
      const config = { withCredentials: true };
      const response = await axios[method](url, payload, config);
      toast.success(`College ${isUpdateMode ? 'updated' : 'created'} successfully!`, { id: 'submit-toast' });
      console.log("Server Response:", response.data);
      if (!isUpdateMode) { resetForm(); } // Reset only on create
    } catch (submissionError) {
      console.error(`Error ${isUpdateMode ? 'updating' : 'creating'} college:`, submissionError);
      const errorMsg = submissionError.response?.data?.message || submissionError.message || "An unknown error occurred.";
       if (submissionError.response?.status === 401 || submissionError.response?.status === 403) { toast.error(`Authentication error: ${errorMsg}. Please log in again.`, { id: 'submit-toast' }); }
       else if (submissionError.response?.status === 400) { toast.error(`Validation error: ${errorMsg}`, { id: 'submit-toast' }); }
       else { toast.error(`Failed to ${isUpdateMode ? 'update' : 'create'} college: ${errorMsg}`, { id: 'submit-toast' }); }
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- Reset Form (resetForm) ---
  // (This function remains exactly the same)
   const resetForm = () => {
      setSelectedCollegeId(""); // Clear selected college ID
      // Reset form data but keep the selected exam ID if present
      setFormData(prev => ({...initialFormData, examId: prev.examId || "" }));
      toast('Form cleared.', { icon: '🧹' });
  }

  // --- Conditional Rendering based on Auth Status ---
  if (authStatus.isLoading) {
    // Show a loading state while checking authentication
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-600">Verifying access...</p>
      </div>
    );
  }

  // If the auth check completed but the user is not an admin, render nothing.
  // The redirect should have already been triggered in the useEffect.
  if (!authStatus.isAdmin) {
    return null; // Or render an Access Denied component
  }

  // --- Render the Form UI (Only if authenticated as Admin) ---
  // This JSX part remains exactly the same as your original code.
  const isFormDisabled = isLoadingExams || isFetchingColleges || isLoadingDetails || isSubmitting;
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Ensure Toaster is rendered, preferably in a root layout */}
      <Toaster position="top-right" reverseOrder={false} />

      <Card className="w-full max-w-5xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            {isUpdateMode ? "Update College Information" : "Create New College Entry"}
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            {isUpdateMode ? `Editing data for ${formData.data.name || 'selected college'}` : "Fill in the details below to add a new college."}
            {isLoadingDetails && isUpdateMode && <Loader2 className="animate-spin h-4 w-4 inline-block ml-2" />}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6 md:p-8">

          {/* --- Exam and College Selection --- */}
          {/* This section's JSX remains unchanged */}
          <div className="space-y-4 p-4 border rounded-md bg-white shadow-sm">
            <h3 className="text-md font-semibold text-gray-700 mb-3">Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="exam-select" className="font-medium text-gray-700">Select Exam { !isUpdateMode && '*' }</Label>
                <Select value={selectedExamId} onValueChange={(value) => setSelectedExamId(value)} disabled={isLoadingExams || isSubmitting}>
                  <SelectTrigger id="exam-select" className="w-full mt-1"><SelectValue placeholder={isLoadingExams ? "Loading..." : "Choose Exam"} /></SelectTrigger>
                  <SelectContent>{exams.length > 0 ? (exams.map((exam) => (<SelectItem key={exam._id} value={exam._id}>{exam.name}</SelectItem>))) : (<SelectItem value="loading" disabled>{isLoadingExams ? "Loading..." : "No exams"}</SelectItem>)}</SelectContent>
                </Select>
                {isLoadingExams && <Loader2 className="animate-spin h-4 w-4 inline-block ml-2 text-gray-500" />}
              </div>
              <div>
                <Label htmlFor="college-select" className="font-medium text-gray-700">Select College (for Update)</Label>
                <Select value={selectedCollegeId} onValueChange={(value) => setSelectedCollegeId(value)} disabled={!selectedExamId || isFetchingColleges || collegesInExam.length === 0 || isSubmitting}>
                  <SelectTrigger id="college-select" className="w-full mt-1"><SelectValue placeholder={isFetchingColleges ? "Loading..." : "Choose College"} /></SelectTrigger>
                  <SelectContent>{collegesInExam.length > 0 ? (collegesInExam.map((college) => (<SelectItem key={college.id} value={college.id}>{college.name} ({college.id.slice(-4)})</SelectItem>))) : (<SelectItem value="no-colleges" disabled>{selectedExamId ? "No colleges" : "Select exam"}</SelectItem>)}</SelectContent>
                </Select>
                {isFetchingColleges && <Loader2 className="animate-spin h-4 w-4 inline-block ml-2 text-gray-500" />}
              </div>
            </div>
            {isUpdateMode && (<Button variant="outline" size="sm" onClick={resetForm} disabled={isSubmitting} className="mt-3">Clear Form / Create New</Button>)}
          </div>

          {/* --- College Basic Info --- */}
          {/* This section's JSX remains unchanged */}
           <div className="space-y-4 p-4 border rounded-md bg-white shadow-sm">
                 <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Basic Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                     <div><Label htmlFor="college-name" className="font-medium text-gray-700">College Name *</Label><Input id="college-name" placeholder="Enter college name" value={formData.data.name} onChange={(e) => handleChange(e, "data.name")} required disabled={isFormDisabled}/></div>
                     <div><Label htmlFor="dte-code" className="font-medium text-gray-700">DTE Code *</Label><Input id="dte-code" type="number" placeholder="Enter DTE code" value={formData.data.dteCode} onChange={(e) => handleChange(e, "data.dteCode")} required disabled={isFormDisabled}/></div>
                     <div><Label htmlFor="location" className="font-medium text-gray-700">Location</Label><Input id="location" placeholder="e.g., Pune, Maharashtra" value={formData.data.location} onChange={(e) => handleChange(e, "data.location")} disabled={isFormDisabled}/></div>
                     <div><Label htmlFor="year" className="font-medium text-gray-700">Year Established</Label><Input id="year" type="number" placeholder="e.g., 1983" value={formData.data.year} onChange={(e) => handleChange(e, "data.year")} disabled={isFormDisabled}/></div>
                     <div><Label htmlFor="affiliation" className="font-medium text-gray-700">Affiliation</Label><Input id="affiliation" placeholder="e.g., SPPU" value={formData.data.affiliation} onChange={(e) => handleChange(e, "data.affiliation")} disabled={isFormDisabled}/></div>
                     <div><Label htmlFor="type" className="font-medium text-gray-700">College Type</Label><Input id="type" placeholder="e.g., Private, Autonomous" value={formData.data.type} onChange={(e) => handleChange(e, "data.type")} disabled={isFormDisabled}/></div>
                     <div className="md:col-span-2 lg:col-span-3"><Label htmlFor="description" className="font-medium text-gray-700">Description</Label><Textarea id="description" placeholder="Brief description..." value={formData.data.description} onChange={(e) => handleChange(e, "data.description")} disabled={isFormDisabled} rows={3}/></div>
                     <div className="md:col-span-2 lg:col-span-3"><Label htmlFor="admission-process" className="font-medium text-gray-700">Admission Process</Label><Textarea id="admission-process" placeholder="Describe admission process..." value={formData.data.admissionProcess} onChange={(e) => handleChange(e, "data.admissionProcess")} disabled={isFormDisabled} rows={3}/></div>
                     <div className="md:col-span-2 lg:col-span-3"><Label htmlFor="infrastructure" className="font-medium text-gray-700">Infrastructure (Comma-separated)</Label><Input id="infrastructure" placeholder="e.g., Library, Hostel, Gym" value={formData.data.infrastructure} onChange={(e) => handleChange(e, "data.infrastructure")} disabled={isFormDisabled}/></div>
                     <div className="md:col-span-2 lg:col-span-3"><Label htmlFor="review" className="font-medium text-gray-700">Overall Review Summary</Label><Textarea id="review" placeholder="Overall review summary..." value={formData.data.review} onChange={(e) => handleChange(e, "data.review")} disabled={isFormDisabled} rows={3}/></div>
                 </div>
             </div>

          {/* --- Image Uploads --- */}
          {/* This section's JSX remains unchanged */}
           <div className="space-y-4 p-4 border rounded-md bg-white shadow-sm">
                 <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Images</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div><Label htmlFor="avatar-image" className="font-medium text-gray-700">Avatar Image (Logo)</Label><Input id="avatar-image" type="file" accept="image/*" onChange={handleAvatarUpload} className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" disabled={isFormDisabled}/>{formData.data.avatarImage && <p className="text-xs text-green-600 mt-1">Avatar set (ID: ...{formData.data.avatarImage.slice(-6)})</p>}</div>
                     <div><Label htmlFor="gallery-images" className="font-medium text-gray-700">Gallery Images (Add More)</Label><Input id="gallery-images" type="file" accept="image/*" multiple onChange={handleImagesUpload} className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" disabled={isFormDisabled}/>{formData.data.images && formData.data.images.length > 0 && <p className="text-xs text-green-600 mt-1">{formData.data.images.length} gallery image(s) linked.</p>}</div>
                 </div>
             </div>

          {/* --- Courses Section --- */}
          {/* This section's JSX remains unchanged, including the commented-out part */}
           {/* <div className="space-y-6 p-4 border rounded-md bg-white shadow-sm">
                 <div className="flex justify-between items-center border-b pb-2"><h3 className="text-lg font-semibold text-gray-700">Courses Offered</h3><Button variant="secondary" size="sm" onClick={addCourse} disabled={isFormDisabled}>+ Add Course</Button></div>
                 {(formData.data.courses || []).map((course, courseIndex) => (
                     <Card key={`course-${courseIndex}`} className="bg-gray-50/50 shadow-md border rounded-md overflow-hidden">
                         <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 bg-gray-100 border-b"><CardTitle className="text-md font-semibold text-gray-800">Course #{courseIndex + 1}: {course.name || "(New Course)"}</CardTitle><Button variant="destructive" size="sm" onClick={() => removeCourse(courseIndex)} disabled={isFormDisabled}>Remove Course</Button></CardHeader>
                         <CardContent className="px-4 py-4 space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div><Label htmlFor={`course-name-${courseIndex}`} className="text-sm font-medium">Course Name</Label><Input id={`course-name-${courseIndex}`} placeholder="e.g., B.E., B.Tech" value={course.name} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.name`)} disabled={isFormDisabled}/></div>
                                 <div><Label htmlFor={`course-duration-${courseIndex}`} className="text-sm font-medium">Duration</Label><Input id={`course-duration-${courseIndex}`} placeholder="e.g., 4 Years" value={course.duration} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.duration`)} disabled={isFormDisabled}/></div>
                             </div>
                             <div className="md:col-span-2"><Label className="text-sm font-medium block mb-1">Course Placement</Label><div className="grid grid-cols-2 gap-3"><Input type="number" placeholder="Average Salary (LPA)" value={course.placements.averageSalary} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.placements.averageSalary`)} disabled={isFormDisabled}/><Input type="number" placeholder="Highest Salary (LPA)" value={course.placements.highestSalary} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.placements.highestSalary`)} disabled={isFormDisabled}/></div></div>
                             <div className="pt-3 border-t mt-4"><div className="flex justify-between items-center mb-2"><h5 className="text-sm font-semibold text-gray-600">Fees Structure</h5><Button size="sm" variant="outline" onClick={() => addFee(courseIndex)} disabled={isFormDisabled}>+ Add Fee</Button></div>{(course.fees || []).map((fee, feeIndex) => (<div key={`fee-${courseIndex}-${feeIndex}`} className="flex gap-2 mb-2 items-center"><Input placeholder="Category (e.g., General, OBC)" value={fee.category} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.fees.${feeIndex}.category`)} className="flex-1" disabled={isFormDisabled}/><Input type="number" placeholder="Amount (INR)" value={fee.amt} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.fees.${feeIndex}.amt`)} className="flex-1" disabled={isFormDisabled}/><Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 h-8 w-8" onClick={() => removeFee(courseIndex, feeIndex)} disabled={isFormDisabled}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg></Button></div>))}</div>
                             <div className="pt-3 border-t mt-4"><div className="flex justify-between items-center mb-2"><h5 className="text-sm font-semibold text-gray-600">Branches / Specializations</h5><Button size="sm" variant="outline" onClick={() => addBranch(courseIndex)} disabled={isFormDisabled}>+ Add Branch</Button></div>{(course.branches || []).map((branch, branchIndex) => (<Card key={`branch-${courseIndex}-${branchIndex}`} className="mt-2 p-3 bg-white shadow-sm border rounded"><CardHeader className="flex flex-row items-center justify-between p-0 mb-2"><Label htmlFor={`branch-name-${courseIndex}-${branchIndex}`} className="text-sm font-medium flex-grow mr-2">Branch Name</Label><Button variant="destructive" size="xs" onClick={() => removeBranch(courseIndex, branchIndex)} disabled={isFormDisabled}>Remove Branch</Button></CardHeader><CardContent className="p-0"><Input id={`branch-name-${courseIndex}-${branchIndex}`} placeholder="e.g., Computer Engineering" value={branch.bName} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.branches.${branchIndex}.bName`)} className="mb-3" disabled={isFormDisabled}/><div className="mt-2 ml-2 pl-2 border-l-2 border-gray-200 space-y-2"><div className="flex justify-between items-center mb-1"><h6 className="text-xs font-semibold text-gray-500 uppercase">Cutoffs</h6><Button size="xs" variant="outline" onClick={() => addCutoff(courseIndex, branchIndex)} disabled={isFormDisabled}>+ Add Cutoff</Button></div>{(branch.cutOffs || []).map((cutoff, cutoffIndex) => (<div key={`cutoff-${courseIndex}-${branchIndex}-${cutoffIndex}`} className="mb-2 flex items-start gap-2"><div className="flex-grow space-y-1"><Input type="text" placeholder="Cutoff Name (e.g., MHT-CET R1)" value={cutoff.name} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.branches.${branchIndex}.cutOffs.${cutoffIndex}.name`)} className="h-8 text-sm" disabled={isFormDisabled}/><Input type="file" accept="image/*" onChange={(e) => handleCutoffImageUpload(e, `data.courses.${courseIndex}.branches.${branchIndex}.cutOffs.${cutoffIndex}.image`)} className="text-xs h-8 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" disabled={isFormDisabled}/>{cutoff.image && <p className="text-xs text-green-600">Img Set (ID: ...{cutoff.image.slice(-4)})</p>}</div><Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 h-8 w-8 mt-1" onClick={() => removeCutoff(courseIndex, branchIndex, cutoffIndex)} disabled={isFormDisabled}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg></Button></div>))}</div></CardContent></Card>))}</div>
                         </CardContent>
                     </Card>
                 ))}
             </div> */}
        </CardContent>

        {/* Card Footer */}
        {/* This section's JSX remains unchanged */}
        <CardFooter className="flex justify-end gap-4 pt-6 pb-6 px-6 border-t bg-gray-50 rounded-b-lg">
            <Button variant="outline" onClick={resetForm} disabled={isSubmitting || isLoadingDetails} className="mr-auto">Reset / Clear Form</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md" onClick={handleSubmit} disabled={isFormDisabled}>
                {isSubmitting ? (<><Loader2 className="animate-spin mr-2 h-4 w-4" />Submitting...</>) : (isUpdateMode ? "Update College" : "Create College")}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
