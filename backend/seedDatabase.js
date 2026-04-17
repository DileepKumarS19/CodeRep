import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '8.8.8.8']);
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import {ProblemModel} from "./db/schema/problemSchema.js"; 

dotenv.config();

const githubApi = axios.create({
    baseURL: "https://api.github.com/repos/exercism/java/contents/exercises/practice",
    headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
    },
});

async function getRawFile(url) {
    try {
        const response = await axios.get(url, {
            headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
        });
        return response.data;
    } catch (error) {
        return null; 
    }
}

async function scrapeExercismData() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB cluster!");

        console.log("Fetching the master list of exercises from GitHub...");
        const { data: exercises } = await githubApi.get("/");
        
        console.log(`Found ${exercises.length} problems! Starting the massive scrape...`);

        // 🔥 MODIFICATION: We are now looping through the FULL array
        for (const exercise of exercises) {
            if (exercise.type !== "dir") continue; 

            const slug = exercise.name;
            console.log(`\n⬇️ Downloading: ${slug}...`);

            const baseUrl = `https://raw.githubusercontent.com/exercism/java/main/exercises/practice/${slug}`;
            
            // 1. Fetch README
            const descriptionUrl = `${baseUrl}/.docs/instructions.md`;
            const descriptionText = await getRawFile(descriptionUrl);

            // 2. Fetch Directory Info to find exact filenames dynamically
            const mainDirInfo = await githubApi.get(`/${slug}/src/main/java`);
            const testDirInfo = await githubApi.get(`/${slug}/src/test/java`);

            const mainFileName = mainDirInfo.data.find(f => f.name.endsWith(".java"))?.name;
            const testFileName = testDirInfo.data.find(f => f.name.endsWith("Test.java"))?.name;

            let starterCode = "";
            let testSuite = "";

            // 3. Fetch actual code content
            if (mainFileName) {
                starterCode = await getRawFile(`${baseUrl}/src/main/java/${mainFileName}`);
            }
            if (testFileName) {
                testSuite = await getRawFile(`${baseUrl}/src/test/java/${testFileName}`);
            }

            // 4. Map to your Schema
            const problemData = {
                slug: slug,
                title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                difficulty: "medium", 
                description: descriptionText || "Description missing",
                supportedLanguages: ["java"],
                testSuite: { java: testSuite },
                starterCode: { java: starterCode },
                executionLimits: { timeLimit: 2000, memoryLimit: 256 },
                topics: ["Java"], 
            };

            // 5. Save to MongoDB (upsert prevents duplicates if you run it twice)
            await ProblemModel.findOneAndUpdate(
                { slug: problemData.slug },
                { $set: problemData },
                { upsert: true, new: true }
            );
            
            console.log(`✅ Saved ${slug} to database!`);

            // ⚠️ CRITICAL: Wait 1 second between problems so GitHub doesn't block us
            await new Promise(resolve => setTimeout(resolve, 1000)); 
        }

        console.log("\n🎉 MASSIVE SEEDING COMPLETE! All problems are in your database.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error during scraping:", error.message);
        process.exit(1);
    }
}

scrapeExercismData();