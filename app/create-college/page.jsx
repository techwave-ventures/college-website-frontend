"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function CreateCollegeForm() {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [colleges, setColleges] = useState([]);
  const [selectedCollegeName, setSelectedCollegeName] = useState("");
  const [formData, setFormData] = useState({
    examId: "",
    data: {
      name: "",
      avatarImage: null,
      description: "",
      images: [],
      dteCode: "",
      location: "",
      year: "",
      affiliation: "",
      type: "",
      admissionProcess: "",
      infrastructure: [],
      reviews: [{ user: "", rating: "", comment: "" }],
      courses: [
        {
          name: "",
          duration: "",
          branches: [{ bName: "", cutOffs: [{ name: "", image: null }] }],
          fees: [{ category: "", amount: "" }],
          placements: { averageSalary: "", highestSalary: "" },
        },
      ],
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get(
          "https://college-website-backend-main.onrender.com/apiv1/exam"
        );
        setExams(res.data.exams);
      } catch (error) {
        console.error(error);
      }
    };
    fetchExams();
  }, []);

  const handleExamSelect = async (examId) => {
    setSelectedExamId(examId);
    setLoading(true);
    setFormData((prev) => ({ ...prev, examId }));

    try {
      const res = await axios.get(
        `https://college-website-backend-main.onrender.com/apiv1/exam/${examId}`
      );
      const collegesData = res.data.exam.colleges.map((college) => ({
        name: college.name,
        id: college._id,
      }));
      setColleges(collegesData);
      if (collegesData.length > 0) {
        setSelectedCollegeName(collegesData[0].name);
        await fetchCollegeData(collegesData[0].id);
      } else {
        setFormData({
          examId: examId,
          data: {
            name: "",
            avatarImage: null,
            description: "",
            images: [],
            dteCode: "",
            location: "",
            year: "",
            affiliation: "",
            type: "",
            admissionProcess: "",
            infrastructure: [],
            reviews: [{ user: "", rating: "", comment: "" }],
            courses: [
              {
                name: "",
                duration: "",
                branches: [{ bName: "", cutOffs: [{ name: "", image: null }] }],
                fees: [{ category: "", amount: "" }],
                placements: { averageSalary: "", highestSalary: "" },
              },
            ],
          },
        });
      }
    } catch (error) {
      console.error("Error fetching exam details:", error);
      alert("Failed to fetch exam details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeSelect = async (collegeName) => {
    setSelectedCollegeName(collegeName);
    const selectedCollegeId = colleges.find((c) => c.name === collegeName)?.id;
    if (selectedCollegeId) {
      await fetchCollegeData(selectedCollegeId);
    }
  };

  const fetchCollegeData = async (collegeId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://college-website-backend-main.onrender.com/apiv1/college/${collegeId}`
      );
      const collegeData = res.data.college;
      setFormData({
        examId: selectedExamId,
        data: {
          name: collegeData.name || "",
          avatarImage: collegeData.avatarImage?._id || null,
          description: collegeData.description || "",
          images: collegeData.images?.map((img) => img._id) || [],
          dteCode: collegeData.dteCode || "",
          location: collegeData.location || "",
          year: collegeData.year || "",
          affiliation: collegeData.affiliation || "",
          type: collegeData.type || "",
          admissionProcess: collegeData.admissionProcess || "",
          infrastructure: collegeData.infrastructure || [],
          reviews: collegeData.reviews || [{ user: "", rating: "", comment: "" }],
          courses:
            collegeData.courses?.map((course) => ({
              name: course.name || "",
              duration: course.duration || "",
              branches:
                course.branches?.map((branch) => ({
                  bName: branch.bName || "",
                  cutOffs:
                    branch.cutOffs?.map((cutoff) => ({
                      name: cutoff.name || "",
                      image: cutoff.image?._id || null,
                    })) || [],
                })) || [],
              fees:
                course.fees?.map((fee) => ({
                  category: fee.category || "",
                  amount: fee.amt || "",
                })) || [],
              placements: {
                averageSalary: course.placement?.averageSalary || "",
                highestSalary: course.placement?.highestSalary || "",
              },
            })) || [],
        },
      });
    } catch (error) {
      console.error("Error fetching college data:", error);
      alert("Failed to fetch college data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, field, subField, index, subIndex, subSubIndex) => {
    const updatedData = { ...formData };

    if (subField === "reviews") {
      // Ensure reviews array exists and has the necessary index
      if (!updatedData.data.reviews) updatedData.data.reviews = [];
      if (!updatedData.data.reviews[index]) updatedData.data.reviews[index] = {};
      updatedData.data.reviews[index][field] = e.target.value;
    } else if (subField === "courses") {
      // Ensure courses array exists and has the necessary indices
      if (!updatedData.data.courses) updatedData.data.courses = [];
      if (!updatedData.data.courses[index]) updatedData.data.courses[index] = {};
      if (subIndex === undefined) {
        updatedData.data.courses[index][field] = e.target.value;
      } else {
        if (!updatedData.data.courses[index].branches)
          updatedData.data.courses[index].branches = [];
        if (!updatedData.data.courses[index].branches[subIndex])
          updatedData.data.courses[index].branches[subIndex] = {};
        if (subSubIndex === undefined) {
          updatedData.data.courses[index].branches[subIndex][field] =
            e.target.value;
        } else {
          if (!updatedData.data.courses[index].branches[subIndex].cutOffs)
            updatedData.data.courses[index].branches[subIndex].cutOffs = [];
          if (!updatedData.data.courses[index].branches[subIndex].cutOffs[subSubIndex])
             updatedData.data.courses[index].branches[subIndex].cutOffs[subSubIndex] = {};
          updatedData.data.courses[index].branches[subIndex].cutOffs[
            subSubIndex
          ][field] = e.target.value;
        }
      }
    } else if (field === "infrastructure") {
      updatedData.data.infrastructure = e.target.value
        .split(",")
        .map((item) => item.trim());
    } else {
      updatedData.data[field] = e.target.value;
    }
    setFormData(updatedData);
  };

  const uploadImage = async (file) => {
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post(
        "https://college-website-backend-main.onrender.com/apiv1/image",
        form
      );
      return res.data.image._id;
    } catch (error) {
      console.error("Image upload failed", error);
      throw error; // Re-throw to be caught in caller
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const id = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          avatarImage: id,
        },
      }));
    } catch (error) {
      alert("Failed to upload avatar image");
    }
  };

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    try {
      const imageIds = await Promise.all(
        files.map((file) => uploadImage(file))
      );
      setFormData((prev) => ({
        ...prev,
        data: { ...prev.data, images: imageIds },
      }));
    } catch (error) {
      alert("Failed to upload one or more images");
    }
  };

  const handleCutoffImageUpload = async (
    e,
    courseIndex,
    branchIndex,
    cutoffIndex
  ) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imageId = await uploadImage(file);
      const updatedFormData = { ...formData };
      updatedFormData.data.courses[courseIndex].branches[branchIndex].cutOffs[
        cutoffIndex
      ].image = imageId || null;
      setFormData(updatedFormData);
    } catch (error) {
      alert("Failed to upload cutoff image");
    }
  };

  const addReview = () =>
    setFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        reviews: [
          ...(prev.data.reviews || []), // Ensure reviews array exists
          { user: "", rating: "", comment: "" },
        ],
      },
    }));

  const addCourse = () =>
    setFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        courses: [
          ...(prev.data.courses || []), // Ensure courses array exists
          {
            name: "",
            duration: "",
            branches: [{ bName: "", cutOffs: [{ name: "", image: null }] }],
            fees: [{ category: "", amount: "" }],
            placements: { averageSalary: "", highestSalary: "" },
          },
        ],
      },
    }));

  const addBranch = (index) =>
    setFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        courses: prev.data.courses.map((c, i) =>
          i === index
            ? {
                ...c,
                branches: [
                  ...(c.branches || []), // Ensure branches array exists
                  { bName: "", cutOffs: [{ name: "", image: null }] },
                ],
              }
            : c
        ),
      },
    }));

  const addCutoff = (courseIndex, branchIndex) =>
    setFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        courses: prev.data.courses.map((c, i) =>
          i === courseIndex
            ? {
                ...c,
                branches: c.branches.map((b, j) =>
                  j === branchIndex
                    ? {
                        ...b,
                        cutOffs: [
                          ...(b.cutOffs || []), // Ensure cutOffs array exists
                          { name: "", image: null },
                        ],
                      }
                    : b
                ),
              }
            : c
        ),
      },
    }));

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://college-website-backend-main.onrender.com/apiv1/college",
        formData
      );
      alert("College created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating college:", error);
      alert("Failed to create college.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <Card className="w-full max-w-3xl p-6">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Create College</h2>

          <label className="block text-gray-700">Select Exam:</label>
          <Select onValueChange={(value) => handleExamSelect(value)}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Choose an Exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam._id} value={exam._id}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-4">
            <label className="block text-gray-700">Avatar Image:</label>
            <Input type="file" accept="image/*" onChange={handleAvatarUpload} />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Images:</label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesUpload}
            />
          </div>

          {Object.keys(formData.data).map((key) =>
            !["courses", "reviews", "images", "avatarImage"].includes(key) ? (
              <div key={key} className="mt-4">
                <label className="block text-gray-700">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </label>
                <Input
                  type="text"
                  value={formData.data[key] || ""}
                  onChange={(e) => handleChange(e, key)}
                  className="w-full mt-2"
                />
              </div>
            ) : null
          )}

          <div className="mt-4">
            <label className="block text-gray-700">
              Infrastructure (comma-separated):
            </label>
            <Input
              type="text"
              value={formData.data.infrastructure?.join(", ") || ""}
              onChange={(e) => handleChange(e, "infrastructure")}
              className="w-full mt-2"
            />
          </div>

          {/* Reviews */}
          <h3 className="text-lg font-semibold mt-6">Reviews</h3>
          {formData.data.reviews?.map((review, index) => (
            <div key={index} className="mt-4">
              <Input
                type="text"
                placeholder="User"
                value={review.user || ""}
                onChange={(e) => handleChange(e, "user", "reviews", index)}
              />
              <Input
                type="text"
                placeholder="Rating"
                value={review.rating || ""}
                onChange={(e) => handleChange(e, "rating", "reviews", index)}
                className="mt-2"
              />
              <Input
                type="text"
                placeholder="Comment"
                value={review.comment || ""}
                onChange={(e) => handleChange(e, "comment", "reviews", index)}
                className="mt-2"
              />
            </div>
          ))}
          <Button className="mt-2 bg-green-500" onClick={addReview}>
            + Add Review
          </Button>

          {/* Courses */}
          <h3 className="text-lg font-semibold mt-6">Courses</h3>
          {formData.data.courses?.map((course, index) => (
            <div key={index} className="mt-4 border p-4 rounded-lg bg-gray-50">
              <Input
                type="text"
                placeholder="Course Name"
                value={course.name || ""}
                onChange={(e) => handleChange(e, "name", "courses", index)}
              />
              <Input
                type="text"
                placeholder="Duration"
                value={course.duration || ""}
                onChange={(e) => handleChange(e, "duration", "courses", index)}
              />
              <Button
                className="mt-2 bg-blue-500"
                onClick={() => addBranch(index)}
              >
                + Add Branch
              </Button>
              {course.branches?.map((branch, bIndex) => (
                <div
                  key={bIndex}
                  className="mt-2 p-2 border rounded bg-white shadow"
                >
                  <Input
                    type="text"
                    placeholder="Branch Name"
                    value={branch.bName || ""}
                    onChange={(e) =>
                      handleChange(e, "bName", "courses", index, bIndex)
                    }
                  />
                  <Button
                    className="mt-2 bg-purple-500"
                    onClick={() => addCutoff(index, bIndex)}
                  >
                    + Add Cutoff
                  </Button>

                  {branch.cutOffs?.map((cutoff, cIndex) => (
                    <div key={cIndex} className="mt-2">
                      <Input
                        type="text"
                        placeholder="Cutoff Name"
                        value={cutoff.name || ""}
                        onChange={(e) =>
                          handleChange(
                            e,
                            "name",
                            "courses",
                            index,
                            bIndex,
                            cIndex
                          )
                        }
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleCutoffImageUpload(e, index, bIndex, cIndex)
                        }
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              ))}
              {/* Fees Input */}
              <h4 className="text-md font-semibold mt-4">Fees</h4>
              {course.fees?.map((fee, feeIndex) => (
                <div key={`fee-${feeIndex}`} className="mt-2 flex gap-2">
                  <Input
                    type="text"
                    placeholder="Category (e.g., General, OBC)"
                    value={fee.category || ""}
                    onChange={(e) =>
                      handleChange(
                        e,
                        "category",
                        "courses",
                        index,
                        feeIndex,
                        "fees"
                      )
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={fee.amount || ""}
                    onChange={(e) =>
                      handleChange(
                        e,
                        "amount",
                        "courses",
                        index,
                        feeIndex,
                        "fees"
                      )
                    }
                  />
                </div>
              ))}
              {/* Placement Input */}
              <h4 className="text-md font-semibold mt-4">Placement</h4>
              <Input
                type="number"
                placeholder="Average Salary"
                value={course.placements?.averageSalary || ""}
                onChange={(e) =>
                  handleChange(
                    e,
                    "averageSalary",
                    "courses",
                    index,
                    "placements"
                  )
                }
              />
              <Input
                type="number"
                placeholder="Highest Salary"
                value={course.placements?.highestSalary || ""}
                onChange={(e) =>
                  handleChange(
                    e,
                    "highestSalary",
                    "courses",
                    index,
                    "placements"
                  )
                }
                className="mt-2"
              />
            </div>
          ))}
          <Button className="mt-4 bg-blue-500" onClick={addCourse}>
            + Add Course
          </Button>

          {/* Submit */}
          <Button
            className="w-full mt-6 bg-green-600 hover:bg-green-800"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}