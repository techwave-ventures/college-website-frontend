"use client"; // Required for components using hooks like useState, useEffect

import { useState, useEffect } from "react";
import axios from "axios"; // For making HTTP requests
import toast, { Toaster } from 'react-hot-toast'; // Import toast

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

// Define the API base URL for your local backend
const API_BASE_URL = "https://college-website-backend-main.onrender.com/apiv1";

// --- Initial State Definition ---
const initialCourseState = {
  name: "",
  duration: "",
  branches: [{ bName: "", cutOffs: [{ name: "", image: "" }] }],
  fees: [{ category: "", amt: "" }], // Use 'amt'
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
export default function CreateOrUpdateCollegeForm() {
  // --- State Variables ---
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [collegesInExam, setCollegesInExam] = useState([]); // Colleges associated with the selected exam
  const [selectedCollegeId, setSelectedCollegeId] = useState(""); // ID of the college being edited
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingColleges, setIsFetchingColleges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const isUpdateMode = !!selectedCollegeId; // Determine if we are updating or creating

  // --- Effects ---
  // Fetch available exams on component mount
  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/exam`);
        setExams(res.data.exams || []);
      } catch (fetchError) {
        console.error("Error fetching exams:", fetchError);
        toast.error("Failed to load exams. Ensure backend is running.");
        setExams([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Fetch colleges when an exam is selected
  useEffect(() => {
    if (!selectedExamId) {
      setCollegesInExam([]);
      setSelectedCollegeId(""); // Reset college selection if exam changes
      setFormData(prev => ({ ...initialFormData, examId: prev.examId })); // Reset form but keep examId
      return;
    }

    const fetchCollegesForExam = async () => {
      setIsFetchingColleges(true);
      setSelectedCollegeId(""); // Reset college selection
      setFormData(prev => ({ ...initialFormData, examId: prev.examId })); // Reset form
      try {
        const res = await axios.get(`${API_BASE_URL}/exam/${selectedExamId}`);
        // Ensure colleges array exists and map correctly
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
  }, [selectedExamId]); // Re-run when selectedExamId changes

  // Fetch full college data when a college is selected for editing
  useEffect(() => {
    if (!selectedCollegeId) {
       // If college ID is cleared, reset form to initial state but keep examId
       setFormData(prev => ({ ...initialFormData, examId: prev.examId }));
       return;
    }

    const fetchCollegeDetails = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/college/${selectedCollegeId}`);
        const collegeData = res.data.college;

        // Map fetched data to form state, providing defaults for missing fields/arrays
        setFormData({
          examId: selectedExamId, // Keep current exam ID
          data: {
            name: collegeData.name || "",
            avatarImage: collegeData.avatarImage?._id || "", // Store only ID
            description: collegeData.description || "",
            images: collegeData.images?.map(img => img._id) || [], // Store only IDs
            dteCode: collegeData.dteCode || "",
            location: collegeData.location || "",
            year: collegeData.year || "",
            affiliation: collegeData.affiliation || "",
            type: collegeData.type || "",
            admissionProcess: collegeData.admissionProcess || "",
            infrastructure: Array.isArray(collegeData.infrastructure) ? collegeData.infrastructure.join(", ") : "", // Join array for input
            review: collegeData.review || "",
            // placement: collegeData.placement?._id || "", // Handle overall placement if needed
            courses: (collegeData.courses?.length > 0 ? collegeData.courses : [initialCourseState]).map(course => ({
              name: course.name || "",
              duration: course.duration || "",
              branches: (course.branches?.length > 0 ? course.branches : [{ bName: "", cutOffs: [{ name: "", image: "" }] }]).map(branch => ({
                bName: branch.bName || "",
                cutOffs: (branch.cutOffs?.length > 0 ? branch.cutOffs : [{ name: "", image: "" }]).map(cutoff => ({
                  name: cutoff.name || "",
                  image: cutoff.image?._id || "", // Store only ID
                })),
              })),
              fees: (course.fees?.length > 0 ? course.fees : [{ category: "", amt: "" }]).map(fee => ({
                category: fee.category || "",
                amt: fee.amt || "", // Use 'amt'
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollegeDetails();
  }, [selectedCollegeId, selectedExamId]); // Re-run if selectedCollegeId changes


  // --- State Update Handlers ---

  // Generic handler for updating nested state properties safely
  const handleNestedChange = (path, value) => {
     setFormData((prev) => {
      const keys = path.split(".");
      let current = JSON.parse(JSON.stringify(prev)); // Deep copy to avoid mutation issues
      let objRef = current;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
         // If a key is a number, ensure the parent is an array
         if (/^\d+$/.test(key) && !Array.isArray(objRef)) {
            console.warn(`Trying to access index '${key}' on non-array at path '${keys.slice(0, i).join('.')}'. State might be inconsistent.`);
            // Attempt recovery or handle error appropriately
            // For now, just log and continue, might lead to errors later
         }
        // If the path segment doesn't exist, create it (object or array)
        if (objRef[key] === undefined || objRef[key] === null) {
           objRef[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
        }
        objRef = objRef[key];
      }

      objRef[keys[keys.length - 1]] = value;
      return current;
    });
  };

  // Specific handler for simple text/number inputs using the generic handler
  const handleChange = (e, path) => {
    handleNestedChange(path, e.target.value);
  };

  // --- Image Upload Logic ---

  // Uploads a single file to Cloudinary via the backend
  const uploadImage = async (file) => {
    if (!file) return null;
    const loadingToastId = toast.loading(`Uploading ${file.name}...`);
    const form = new FormData();
    form.append("file", file);
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // Assuming cookie auth, adjust if using Bearer token
      };
      const res = await axios.post(`${API_BASE_URL}/image`, form, config);
      toast.success(`${file.name} uploaded successfully!`, { id: loadingToastId });
      return res.data.image?._id || null;
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      const errorMsg = uploadError.response?.data?.message || uploadError.message;
      toast.error(`Failed to upload ${file.name}: ${errorMsg}`, { id: loadingToastId });
      return null;
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const id = await uploadImage(file);
    if (id) {
      handleNestedChange("data.avatarImage", id);
    }
  };

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const ids = await Promise.all(files.map((file) => uploadImage(file)));
    const validIds = ids.filter((id) => id !== null);
    if (validIds.length > 0) {
      handleNestedChange("data.images", [
        ...(formData.data.images || []), // Append to existing images
        ...validIds,
      ]);
    }
     // Clear the file input after successful upload if possible (browser security might prevent this)
     e.target.value = null;
  };

  const handleCutoffImageUpload = async (e, path) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageId = await uploadImage(file);
    if (imageId) {
      handleNestedChange(path, imageId);
    }
     e.target.value = null; // Clear input
  };

  // --- Dynamic Array Management ---

  const addCourse = () => {
    handleNestedChange("data.courses", [
      ...formData.data.courses,
      initialCourseState, // Add a new empty course structure
    ]);
  };

  const removeCourse = (courseIndex) => {
     handleNestedChange("data.courses", formData.data.courses.filter((_, index) => index !== courseIndex));
  }

  const addBranch = (courseIndex) => {
    const newBranch = { bName: "", cutOffs: [{ name: "", image: "" }] };
    const currentBranches = formData.data.courses[courseIndex]?.branches || [];
    handleNestedChange(`data.courses.${courseIndex}.branches`, [
      ...currentBranches,
      newBranch,
    ]);
  };

   const removeBranch = (courseIndex, branchIndex) => {
      const currentBranches = formData.data.courses[courseIndex]?.branches || [];
      handleNestedChange(`data.courses.${courseIndex}.branches`, currentBranches.filter((_, index) => index !== branchIndex));
   }

  const addCutoff = (courseIndex, branchIndex) => {
    const newCutoff = { name: "", image: "" };
    const currentCutoffs =
      formData.data.courses[courseIndex]?.branches[branchIndex]?.cutOffs || [];
    handleNestedChange(
      `data.courses.${courseIndex}.branches.${branchIndex}.cutOffs`,
      [...currentCutoffs, newCutoff]
    );
  };

   const removeCutoff = (courseIndex, branchIndex, cutoffIndex) => {
      const currentCutoffs = formData.data.courses[courseIndex]?.branches[branchIndex]?.cutOffs || [];
      handleNestedChange(
         `data.courses.${courseIndex}.branches.${branchIndex}.cutOffs`,
         currentCutoffs.filter((_, index) => index !== cutoffIndex)
      );
   }

   const addFee = (courseIndex) => {
     const newFee = { category: "", amt: "" };
     const currentFees = formData.data.courses[courseIndex]?.fees || [];
     handleNestedChange(`data.courses.${courseIndex}.fees`, [
       ...currentFees,
       newFee,
     ]);
   };

    const removeFee = (courseIndex, feeIndex) => {
      const currentFees = formData.data.courses[courseIndex]?.fees || [];
      handleNestedChange(`data.courses.${courseIndex}.fees`, currentFees.filter((_, index) => index !== feeIndex));
   }


  // --- Form Submission ---

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Basic Validation
    if (!formData.examId) {
        toast.error("Please select an exam.");
        setIsSubmitting(false);
        return;
    }
     if (!formData.data.name || !formData.data.dteCode) {
        toast.error("College Name and DTE Code are required.");
        setIsSubmitting(false);
        return;
    }
    // Add more validation as needed

    // Prepare data for submission (e.g., splitting infrastructure string)
    const dataToSubmit = {
        examId: formData.examId, // examId is needed for create, not update
        data: {
            ...formData.data,
            // Split infrastructure string into array, trim items, remove empty strings
            infrastructure: formData.data.infrastructure
                ? formData.data.infrastructure.split(',').map(item => item.trim()).filter(Boolean)
                : [],
             // Ensure numeric fields are numbers (or handle on backend) - Example
             dteCode: Number(formData.data.dteCode) || 0,
             courses: formData.data.courses.map(course => ({
                ...course,
                fees: course.fees.map(fee => ({ ...fee, amt: Number(fee.amt) || 0 })),
                placements: {
                    averageSalary: Number(course.placements.averageSalary) || 0,
                    highestSalary: Number(course.placements.highestSalary) || 0,
                }
             }))
        }
    };

    // If updating, remove examId from the top level as it's not needed for the PUT request body
    const payload = isUpdateMode ? dataToSubmit.data : dataToSubmit;
    const url = isUpdateMode ? `${API_BASE_URL}/college/${selectedCollegeId}` : `${API_BASE_URL}/college`;
    const method = isUpdateMode ? 'put' : 'post';

    console.log(`Submitting (${method.toUpperCase()}) to ${url}:`, JSON.stringify(payload, null, 2));

    try {
      const config = { withCredentials: true }; // Assuming cookie auth
      const response = await axios[method](url, payload, config);

      toast.success(`College ${isUpdateMode ? 'updated' : 'created'} successfully!`);
      console.log("Server Response:", response.data);

      // Optionally reset form after successful creation or update
      // resetForm(); // Call reset function if needed

    } catch (submissionError) {
      console.error(`Error ${isUpdateMode ? 'updating' : 'creating'} college:`, submissionError);
      const errorMsg = submissionError.response?.data?.message || submissionError.message;
      toast.error(`Failed to ${isUpdateMode ? 'update' : 'create'} college: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Reset Form ---
  const resetForm = () => {
      setSelectedCollegeId(""); // Clear selected college ID
      // Reset form data but keep the selected exam ID
      setFormData(prev => ({...initialFormData, examId: prev.examId }));
      toast('Form cleared.', { icon: '🧹' });
  }

  // --- Render ---
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add Toaster component in your main layout file */}
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      <Card className="w-full max-w-5xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            {isUpdateMode ? "Update College Information" : "Create New College Entry"}
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            {isUpdateMode ? `Editing data for ${formData.data.name}` : "Fill in the details below to add a new college."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* --- Exam and College Selection --- */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="exam-select" className="font-medium text-gray-700">
                  Select Exam *
                </Label>
                <Select
                  value={selectedExamId}
                  onValueChange={(value) => setSelectedExamId(value)} // Update examId state
                  disabled={isLoading || isFetchingColleges}
                >
                  <SelectTrigger id="exam-select" className="w-full mt-1">
                    <SelectValue placeholder="Choose an Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.length > 0 ? (
                      exams.map((exam) => (
                        <SelectItem key={exam._id} value={exam._id}>
                          {exam.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        {isLoading ? "Loading exams..." : "No exams found"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="college-select" className="font-medium text-gray-700">
                  Select College (for Update)
                </Label>
                <Select
                  value={selectedCollegeId}
                  onValueChange={(value) => setSelectedCollegeId(value)} // Update collegeId state
                  disabled={!selectedExamId || isFetchingColleges || collegesInExam.length === 0}
                >
                  <SelectTrigger id="college-select" className="w-full mt-1">
                    <SelectValue placeholder={isFetchingColleges ? "Loading colleges..." : "Choose College to Update"} />
                  </SelectTrigger>
                  <SelectContent>
                    {collegesInExam.length > 0 ? (
                       collegesInExam.map((college) => (
                        <SelectItem key={college.id} value={college.id}>
                          {college.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-colleges" disabled>
                        {selectedExamId ? "No colleges found for this exam" : "Select an exam first"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                 {isFetchingColleges && <Loader2 className="animate-spin text-gray-500 h-4 w-4 inline-block ml-2" />}
              </div>
            </div>
             {isUpdateMode && (
                <Button variant="outline" size="sm" onClick={resetForm} disabled={isSubmitting}>
                    Clear Form / Create New
                </Button>
             )}
          </div>

          {/* <Separator /> */}

          {/* --- College Basic Info --- */}
          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="college-name" className="font-medium text-gray-700">College Name *</Label>
                  <Input id="college-name" placeholder="Enter college name" value={formData.data.name} onChange={(e) => handleChange(e, "data.name")} required disabled={isSubmitting}/>
                </div>
                <div>
                  <Label htmlFor="dte-code" className="font-medium text-gray-700">DTE Code *</Label>
                  <Input id="dte-code" type="number" placeholder="Enter DTE code" value={formData.data.dteCode} onChange={(e) => handleChange(e, "data.dteCode")} required disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="location" className="font-medium text-gray-700">Location</Label>
                  <Input id="location" placeholder="e.g., Pune, Maharashtra" value={formData.data.location} onChange={(e) => handleChange(e, "data.location")} disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="year" className="font-medium text-gray-700">Year Established</Label>
                  <Input id="year" placeholder="e.g., 1983" value={formData.data.year} onChange={(e) => handleChange(e, "data.year")} disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="affiliation" className="font-medium text-gray-700">Affiliation</Label>
                  <Input id="affiliation" placeholder="e.g., SPPU" value={formData.data.affiliation} onChange={(e) => handleChange(e, "data.affiliation")} disabled={isSubmitting}/>
                </div>
                 <div>
                  <Label htmlFor="type" className="font-medium text-gray-700">College Type</Label>
                  <Input id="type" placeholder="e.g., Private, Autonomous" value={formData.data.type} onChange={(e) => handleChange(e, "data.type")} disabled={isSubmitting}/>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <Label htmlFor="description" className="font-medium text-gray-700">Description</Label>
                  <Textarea id="description" placeholder="Brief description..." value={formData.data.description} onChange={(e) => handleChange(e, "data.description")} disabled={isSubmitting}/>
                </div>
                 <div className="md:col-span-2 lg:col-span-3">
                  <Label htmlFor="admission-process" className="font-medium text-gray-700">Admission Process</Label>
                  <Textarea id="admission-process" placeholder="Describe the admission process..." value={formData.data.admissionProcess} onChange={(e) => handleChange(e, "data.admissionProcess")} disabled={isSubmitting}/>
                </div>
                 <div className="md:col-span-2 lg:col-span-3">
                  <Label htmlFor="infrastructure" className="font-medium text-gray-700">Infrastructure (Comma-separated)</Label>
                  <Input id="infrastructure" placeholder="e.g., Library, Hostel, Gym" value={formData.data.infrastructure} onChange={(e) => handleChange(e, "data.infrastructure")} disabled={isSubmitting}/>
                </div>
                 <div className="md:col-span-2 lg:col-span-3">
                  <Label htmlFor="review" className="font-medium text-gray-700">Overall Review Summary</Label>
                  <Textarea id="review" placeholder="Overall review summary..." value={formData.data.review} onChange={(e) => handleChange(e, "data.review")} disabled={isSubmitting}/>
                </div>
             </div>
          </div>

          {/* <Separator /> */}

          {/* --- Image Uploads --- */}
           <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <Label htmlFor="avatar-image" className="font-medium text-gray-700">Avatar Image (Logo)</Label>
                  <Input id="avatar-image" type="file" accept="image/*" onChange={handleAvatarUpload} className="mt-1" disabled={isSubmitting}/>
                  {formData.data.avatarImage && <p className="text-xs text-green-600 mt-1">Avatar set (ID: ...{formData.data.avatarImage.slice(-6)})</p>}
                </div>
                 <div>
                  <Label htmlFor="gallery-images" className="font-medium text-gray-700">Gallery Images (Add More)</Label>
                  <Input id="gallery-images" type="file" accept="image/*" multiple onChange={handleImagesUpload} className="mt-1" disabled={isSubmitting}/>
                   {formData.data.images && formData.data.images.length > 0 && <p className="text-xs text-green-600 mt-1">{formData.data.images.length} gallery image(s) linked.</p>}
                   {/* TODO: Add way to view/remove existing gallery images */}
                </div>
              </div>
           </div>

          {/* <Separator /> */}

          {/* --- Courses Section --- */}

          {/* <div className="space-y-6">
             <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-700">Courses Offered</h3>
                 <Button variant="secondary" onClick={addCourse} disabled={isSubmitting}>
                    + Add Course
                </Button>
             </div>

             {formData.data.courses.map((course, courseIndex) => (
                <Card key={`course-${courseIndex}`} className="bg-gray-50 shadow-md">
                   <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                      <CardTitle className="text-md font-semibold text-gray-800">
                         Course #{courseIndex + 1}: {course.name || "(New Course)"}
                      </CardTitle>
                      <Button variant="destructive" size="sm" onClick={() => removeCourse(courseIndex)} disabled={isSubmitting}>Remove Course</Button>
                   </CardHeader>
                   <CardContent className="px-4 pb-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <Label htmlFor={`course-name-${courseIndex}`} className="text-sm font-medium">Course Name</Label>
                           <Input id={`course-name-${courseIndex}`} placeholder="e.g., B.E., B.Tech" value={course.name} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.name`)} disabled={isSubmitting}/>
                         </div>
                         <div>
                           <Label htmlFor={`course-duration-${courseIndex}`} className="text-sm font-medium">Duration</Label>
                           <Input id={`course-duration-${courseIndex}`} placeholder="e.g., 4 Years" value={course.duration} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.duration`)} disabled={isSubmitting}/>
                         </div>
                         <div className="md:col-span-2">
                           <Label className="text-sm font-medium">Course Placement</Label>
                           <div className="grid grid-cols-2 gap-3 mt-1">
                             <Input type="number" placeholder="Average Salary (LPA)" value={course.placements.averageSalary} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.placements.averageSalary`)} disabled={isSubmitting}/>
                             <Input type="number" placeholder="Highest Salary (LPA)" value={course.placements.highestSalary} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.placements.highestSalary`)} disabled={isSubmitting}/>
                           </div>
                         </div>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center mb-2">
                           <h5 className="text-sm font-semibold text-gray-600">Fees</h5>
                           <Button size="sm" variant="outline" onClick={() => addFee(courseIndex)} disabled={isSubmitting}>+ Add Fee</Button>
                        </div>
                         {course.fees.map((fee, feeIndex) => (
                           <div key={`fee-${courseIndex}-${feeIndex}`} className="flex gap-2 mb-2 items-center">
                             <Input placeholder="Category (e.g., General)" value={fee.category} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.fees.${feeIndex}.category`)} className="flex-1" disabled={isSubmitting}/>
                             <Input type="number" placeholder="Amount" value={fee.amt} onChange={(e) => handleChange(e, `data.courses.${courseIndex}.fees.${feeIndex}.amt`)} className="flex-1" disabled={isSubmitting}/>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-100 px-2" onClick={() => removeFee(courseIndex, feeIndex)} disabled={isSubmitting}>X</Button>
                           </div>
                         ))}
                      </div>

                      <div className="pt-3 border-t">
                         <div className="flex justify-between items-center mb-2">
                             <h5 className="text-sm font-semibold text-gray-600">Branches</h5>
                             <Button size="sm" variant="outline" onClick={() => addBranch(courseIndex)} disabled={isSubmitting}>+ Add Branch</Button>
                         </div>
                         {course.branches.map((branch, branchIndex) => (
                           <Card key={`branch-${courseIndex}-${branchIndex}`} className="mt-2 p-3 bg-white shadow-sm">
                              <CardHeader className="flex flex-row items-center justify-between p-0 mb-2">
                                  <Label htmlFor={`branch-name-${courseIndex}-${branchIndex}`} className="text-sm font-medium flex-grow mr-2">Branch Name</Label>
                                  <Button variant="destructive" size="xs" onClick={() => removeBranch(courseIndex, branchIndex)} disabled={isSubmitting}>Remove Branch</Button>
                              </CardHeader>
                              <CardContent className="p-0">
                                 <Input
                                   id={`branch-name-${courseIndex}-${branchIndex}`}
                                   placeholder="e.g., Computer Engineering" value={branch.bName}
                                   onChange={(e) => handleChange(e, `data.courses.${courseIndex}.branches.${branchIndex}.bName`)}
                                   className="mb-2" disabled={isSubmitting}
                                 />

                                 <div className="mt-2 ml-2 pl-2 border-l space-y-2">
                                     <div className="flex justify-between items-center mb-1">
                                         <h6 className="text-xs font-semibold text-gray-500 uppercase">Cutoffs</h6>
                                         <Button size="xs" variant="outline" onClick={() => addCutoff(courseIndex, branchIndex)} disabled={isSubmitting}>+ Add Cutoff</Button>
                                     </div>
                                    {branch.cutOffs.map((cutoff, cutoffIndex) => (
                                     <div key={`cutoff-${courseIndex}-${branchIndex}-${cutoffIndex}`} className="mb-2 flex items-center gap-2">
                                        <div className="flex-grow space-y-1">
                                           <Input
                                             type="text" placeholder="Cutoff Name (e.g., JEE R1)" value={cutoff.name}
                                             onChange={(e) => handleChange(e, `data.courses.${courseIndex}.branches.${branchIndex}.cutOffs.${cutoffIndex}.name`)}
                                             className="h-8 text-sm" disabled={isSubmitting}
                                           />
                                           <Input
                                             type="file" accept="image/*"
                                             onChange={(e) => handleCutoffImageUpload(e, `data.courses.${courseIndex}.branches.${branchIndex}.cutOffs.${cutoffIndex}.image`)}
                                             className="text-xs h-8" disabled={isSubmitting}
                                           />
                                           {cutoff.image && <p className="text-xs text-green-600">Img Set</p>}
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-100 px-2 self-start" onClick={() => removeCutoff(courseIndex, branchIndex, cutoffIndex)} disabled={isSubmitting}>X</Button>
                                     </div>
                                    ))}
                                 </div>
                              </CardContent>
                           </Card>
                         ))}
                      </div>
                   </CardContent>
                </Card>
             ))}
          </div> */}

        </CardContent>
        <CardFooter className="flex justify-end pt-6 border-t">
           <Button
              variant="secondary"
              onClick={resetForm}
              disabled={isSubmitting}
              className="mr-4"
            >
              Reset / Clear
            </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || isFetchingColleges}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              isUpdateMode ? "Update College" : "Create College"
            )}
          </Button>
        </CardFooter>
      </Card>
       {/* Add Toaster component in your main layout file */}
       <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
