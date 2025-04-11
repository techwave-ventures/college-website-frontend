"use client"
import { useRouter } from "next/navigation";
import Footer from "../_components/Footer";
import Navbar from "../_components/Navbar";

export default function ExploreColleges() {
  const router=useRouter();
  const exams=[
    "JEE Advance", "JEE-MAIN", "NEET", "MHT-CET"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12 mt-20">
        
        {/* Hero Section */}
        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dream Big, Choose Smart: Find Your Ideal College Today!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Selecting the right college is crucial for your future. Consider academic programs, campus culture, and career opportunities. Research schools that align with your goals and provide robust support and alumni networks.
          </p>

          {/* Entrance Exam Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {exams.map((exam) => (
              <div key={exam} className="bg-gray-200 rounded-lg p-6 flex flex-col items-center shadow-md">
                <div className="w-16 h-16 bg-gray-300 rounded-md mb-3"></div>
                <p className="font-semibold">{exam}</p>
              </div>
            ))}
          </div>

          <button className="px-6 py-2 border rounded-md text-gray-800 mr-4 hover:bg-gray-200">
            Learn More
          </button>
          <button onClick={() => router.push("/auth/signup")} className="px-6 py-2 border rounded-md bg-gray-900 text-white hover:bg-gray-700">
            Sign Up
          </button>
        </section>

        {/* College Information Section */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Comprehensive College Information at Your Fingertips
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Our platform provides detailed insights into colleges, including their rankings, fees, courses offered, placements, and facilities. Make informed decisions about your education with the information you need.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "In-Depth College Rankings and Fees Overview", desc: "Compare colleges based on their rankings and tuition costs." },
              { title: "Courses Offered and Career Opportunities", desc: "Discover various courses and their career prospects." },
              { title: "Placement Records and Success Stories", desc: "Learn about placement success rates and alumni achievements." }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="w-10 h-10 bg-gray-300 rounded-full mb-4 mx-auto"></div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-gray-600 mt-2">{feature.desc}</p>
              </div>
            ))}
          </div>

          <button className="px-6 py-2 border rounded-md text-gray-800 mr-4 mt-6 hover:bg-gray-200">
            Learn More
          </button>
          <button className="px-6 py-2 border rounded-md bg-gray-900 text-white hover:bg-gray-700">
            Compare
          </button>
        </section>

        {/* Compare Colleges Section */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Easily Compare Colleges to Make Informed Decisions for Your Future
            </h2>
            <p className="text-gray-600 mb-6">
              Our college comparison tool empowers students to evaluate multiple institutions side by side. Discover essential details like rankings, fees, and courses to find the perfect fit for your academic journey.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Compare Colleges</h3>
                <p className="text-gray-600 text-sm">
                  Make informed choices by comparing colleges based on your preferences.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Easy Evaluation</h3>
                <p className="text-gray-600 text-sm">
                  Utilize our tool to streamline your college selection process.
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder for image */}
          <div className="w-full h-60 bg-gray-300 rounded-lg"></div>
        </section>

        {/* Filters Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Streamlined Filters for Entrance Exam-Based College Selection
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Finding the right college can be overwhelming, especially with numerous entrance exams like JEE, CET, and NEET. Our intuitive filters allow you to narrow down your options based on your exam scores and preferences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Tailored College Recommendations", desc: "Discover colleges that align with your academic achievements." },
              { title: "Comprehensive Filters for JEE, CET, NEET", desc: "Utilize our advanced filtering options to find the best college fit." },
              { title: "Easily Compare Colleges", desc: "Evaluate multiple institutions side by side for the perfect choice." }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="w-10 h-10 bg-gray-300 rounded-full mb-4 mx-auto"></div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-gray-600 mt-2">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
