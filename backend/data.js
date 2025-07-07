import mongoose from "mongoose";
import Profile from "./models/profile.model.js"; // Adjust the path as per your folder structure

async function addSampleProfiles() {
  await mongoose.connect("mongodb://localhost:27017/your-db-name"); // Replace with your actual MongoDB URL

  // Replace these with valid user IDs from your User collection
  const userId1 = '6860a84d0786b9bb10902f93';
  const userId2 = '686bafd9dd6087ce677847d9';
  const userId3 = '686bb002dd6087ce677847de';

  const profileData1 = {
    userId: userId1,
    bio: "Full-stack developer with a passion for open source and teaching.",
    currentPost: "Software Engineer at OpenAI",
    pastWork: [
      { company: "Google", position: "Frontend Developer", years: "2" },
      { company: "Microsoft", position: "Software Intern", years: "1" }
    ],
    education: [
      { school: "IIT Bombay", degree: "B.Tech", fieldOfStudy: "Computer Science" },
      { school: "ABC Junior College", degree: "Intermediate", fieldOfStudy: "MPC" }
    ]
  };

  const profileData2 = {
    userId: userId2,
    bio: "Backend developer with experience in cloud architecture and DevOps.",
    currentPost: "Backend Engineer at Amazon",
    pastWork: [
      { company: "TCS", position: "DevOps Engineer", years: "1.5" },
      { company: "Infosys", position: "System Engineer", years: "2" }
    ],
    education: [
      { school: "NIT Trichy", degree: "B.Tech", fieldOfStudy: "Information Technology" },
      { school: "XYZ High School", degree: "HSC", fieldOfStudy: "Science" }
    ]
  };

  const profileData3 = {
    userId: userId3,
    bio: "UI/UX designer with a creative approach to user interaction and design systems.",
    currentPost: "Product Designer at Adobe",
    pastWork: [
      { company: "Zoho", position: "UI Designer", years: "2" },
      { company: "Freelance", position: "UX Consultant", years: "1" }
    ],
    education: [
      { school: "IIT Guwahati", degree: "B.Des", fieldOfStudy: "Design" },
      { school: "National Institute of Design", degree: "Foundation Year", fieldOfStudy: "Visual Communication" }
    ]
  };

  try {
    await Profile.insertMany([profileData1, profileData2, profileData3]);
    console.log("All sample profiles inserted successfully!");
  } catch (error) {
    console.error("Error inserting profiles:", error);
  } 
}

addSampleProfiles();
