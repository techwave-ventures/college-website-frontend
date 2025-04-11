"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateCollegeForm() {
  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState({
    examId: "",
    data: {
      name: "",
      location: "",
      year: "",
      affiliation: "",
      type: "",
      admissionProcess: "",
      infrastructure: "",
      reviews: [{ user: "", rating: "", comment: "" }],
      courses: [
        {
          name: "",
          duration: "",
          branches: [{ bName: "", cutOffs: [{ name: "", image: "" }] }],
          fees: [{ category: "", amount: "" }],
          placements: { averageSalary: "", highestSalary: "" },
        },
      ],
    },
  });

  useEffect(() => {
    const fetchExams = async ()=>{
      try {
        const res= await axios.get("https://college-website-backend-main.onrender.com/apiv1/exam");
        setExams(res.data.body);
      } catch (error) {
        console.error(error);
      }
    }
    (async()=>{
      await fetchExams();
    })()
  }, []);

  const handleChange = (e, field, subField, index, subIndex, subSubIndex) => {
    const updatedData = { ...formData };

    if (subField === "reviews") {
      updatedData.data.reviews[index][field] = e.target.value;
    } else if (subField === "courses") {
      if (subIndex === undefined) {
        updatedData.data.courses[index][field] = e.target.value;
      } else if (subSubIndex === undefined) {
        updatedData.data.courses[index][subField][subIndex][field] = e.target.value;
      } else {
        updatedData.data.courses[index][subField][subIndex].cutOffs[subSubIndex][field] = e.target.value;
      }
    } else {
      updatedData.data[field] = e.target.value;
    }
    setFormData(updatedData);
  };

  const addReview = () => setFormData({ ...formData, data: { ...formData.data, reviews: [...formData.data.reviews, { user: "", rating: "", comment: "" }] } });
  const addCourse = () => setFormData({ ...formData, data: { ...formData.data, courses: [...formData.data.courses, { name: "", duration: "", branches: [{ bName: "", cutOffs: [{ name: "", image: "" }] }], fees: [{ category: "", amount: "" }], placements: { averageSalary: "", highestSalary: "" } }] } });
  const addBranch = (index) => setFormData({ ...formData, data: { ...formData.data, courses: formData.data.courses.map((c, i) => i === index ? { ...c, branches: [...c.branches, { bName: "", cutOffs: [{ name: "", image: "" }] }] } : c) } });
  const addCutoff = (courseIndex, branchIndex) => setFormData({ ...formData, data: { ...formData.data, courses: formData.data.courses.map((c, i) => i === courseIndex ? { ...c, branches: c.branches.map((b, j) => j === branchIndex ? { ...b, cutOffs: [...b.cutOffs, { name: "", image: "" }] } : b) } : c) } });

  const handleSubmit = async () => {
    try {
      const response = await axios.post("https://college-website-backend-main.onrender.com/apiv1/college", formData);
      alert("College created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating college:", error);
      alert("Failed to create college.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-3xl p-6 shadow-lg bg-white">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Create College</h2>

          {/* Exam Selection */}
          <label className="block text-gray-700">Select Exam:</label>
          <Select onValueChange={(value) => setFormData({ ...formData, examId: value })}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Choose an Exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam._id} value={exam._id}>{exam.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* College Details */}
          {Object.keys(formData.data).map((key) =>
            key !== "reviews" && key !== "courses" && key !== "placements" ? (
              <div key={key} className="mt-4">
                <label className="block text-gray-700">{key.replace(/([A-Z])/g, " $1").trim()}:</label>
                <Input type="text" value={formData.data[key]} onChange={(e) => handleChange(e, key)} className="w-full mt-2" />
              </div>
            ) : null
          )}

          {/* Reviews */}
          <h3 className="text-lg font-semibold mt-6">Reviews</h3>
          {formData.data.reviews.map((review, index) => (
            <div key={index} className="mt-4">
              <Input type="text" placeholder="User" value={review.user} onChange={(e) => handleChange(e, "user", "reviews", index)} />
              <Input type="text" placeholder="Rating" value={review.rating} onChange={(e) => handleChange(e, "rating", "reviews", index)} className="mt-2" />
              <Input type="text" placeholder="Comment" value={review.comment} onChange={(e) => handleChange(e, "comment", "reviews", index)} className="mt-2" />
            </div>
          ))}
          <Button className="mt-2 bg-green-500 hover:bg-green-700" onClick={addReview}>+ Add Review</Button>

          {/* Courses */}
          <h3 className="text-lg font-semibold mt-6">Courses</h3>
          {formData.data.courses.map((course, index) => (
            <div key={index} className="mt-4 border p-4 rounded-lg bg-gray-50">
              <Input type="text" placeholder="Course Name" value={course.name} onChange={(e) => handleChange(e, "name", "courses", index)} />
              <Button className="mt-2 bg-blue-500 hover:bg-blue-700" onClick={() => addBranch(index)}>+ Add Branch</Button>
              {course.branches.map((branch, bIndex) => (
                <div key={bIndex} className="mt-2 p-2 border rounded bg-white">
                  <Input type="text" placeholder="Branch Name" value={branch.bName} onChange={(e) => handleChange(e, "bName", "branches", index, bIndex)} />
                  <Button className="mt-2 bg-purple-500 hover:bg-purple-700" onClick={() => addCutoff(index, bIndex)}>+ Add Cutoff</Button>
                </div>
              ))}
            </div>
          ))}
          <Button className="mt-4 bg-blue-500 hover:bg-blue-700" onClick={addCourse}>+ Add Course</Button>

          {/* Submit */}
          <Button className="w-full mt-6 bg-green-600 hover:bg-green-800" onClick={handleSubmit}>
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
