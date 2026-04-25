import dns from 'node:dns/promises';

// Forces Node to use public DNS servers that support SRV records
dns.setServers(['1.1.1.1', '8.8.8.8']);

import mongoose from "mongoose"
import axios from "axios"
import { ProblemModel } from "./db/schema/problemSchema.js"

const githubApi = axios.create({
    baseURL: "https://api.github.com/repos/exercism/java/contents/exercises/practice",
    headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
    },
})

async function getRawFile(url) {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    })
    return response.data  // axios already parses JSON automatically
  } catch {
    return null
  }
}

function stripDisabled(code) {
    if (!code) return ""
    return code
        .split('\n')
        .filter(line => !line.trim().startsWith('@Disabled'))
        .filter(line => !line.includes('import org.junit.jupiter.api.Disabled'))
        .join('\n')
}

function splitTestSuite(rawCode) {
    const cleaned = stripDisabled(rawCode)
    const lines = cleaned.split('\n')
    const testStartIndices = []

    lines.forEach((line, i) => {
        if (line.trim() === '@Test') testStartIndices.push(i)
    })

    if (testStartIndices.length <= 2) {
        return { run: cleaned, submit: cleaned }
    }

    const cutPoint = testStartIndices[2]
    const runLines = [...lines.slice(0, cutPoint), '}']

    return {
        run: runLines.join('\n'),
        submit: cleaned
    }
}

function mapDifficulty(level) {
    if (!level) return "Medium"
    if (level <= 3) return "Easy"
    if (level <= 6) return "Medium"
    return "Hard"
}

function toTitleCase(slug) {
    return slug.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

async function scrapeExercismData() {
    try {
        console.log("Connecting to MongoDB...")
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected!")

        const { data: exercises } = await githubApi.get("/")
        console.log(`Found ${exercises.length} exercises`)

        let problemCount = 0

        for (const exercise of exercises) {
            if (exercise.type !== "dir") continue

            const slug = exercise.name
            console.log(`\nDownloading: ${slug}...`)

            const baseUrl = `https://raw.githubusercontent.com/exercism/java/main/exercises/practice/${slug}`

            // fetch description
            const description = await getRawFile(`${baseUrl}/.docs/instructions.md`)

            // fetch meta for difficulty and topics
            const metaRaw = await getRawFile(`${baseUrl}/.meta/config.json`)
            const meta = metaRaw
                ? (typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw)
                : {}

            // fetch file names dynamically
            const [mainDirInfo, testDirInfo] = await Promise.all([
                githubApi.get(`/${slug}/src/main/java`).catch(() => ({ data: [] })),
                githubApi.get(`/${slug}/src/test/java`).catch(() => ({ data: [] }))
            ])

            const mainFileName = mainDirInfo.data.find(f => f.name.endsWith(".java") && !f.name.endsWith("Test.java"))?.name
            const testFileName = testDirInfo.data.find(f => f.name.endsWith("Test.java"))?.name

            const [starterCode, rawTestSuite] = await Promise.all([
                mainFileName ? getRawFile(`${baseUrl}/src/main/java/${mainFileName}`) : Promise.resolve(""),
                testFileName ? getRawFile(`${baseUrl}/src/test/java/${testFileName}`) : Promise.resolve("")
            ])

            // split into run (2 tests) and submit (all tests)
            const testSuiteSplit = splitTestSuite(rawTestSuite)

            problemCount++

            const problemData = {
                id: problemCount,
                slug,
                title: toTitleCase(slug),
                difficulty: mapDifficulty(meta.difficulty),
                topics: meta.practices?.length ? meta.practices : ["General"],
                description: description || "Description not available",
                examples: [],   // populate manually or from canonical-data later
                supportedLanguages: ["java"],
                starterCode: { java: starterCode || "" },
                testSuite: {
                    java: {
                        run: testSuiteSplit.run,
                        submit: testSuiteSplit.submit
                    }
                },
                executionLimits: { timeLimit: 2000, memoryLimit: 256 }
            }

            await ProblemModel.findOneAndUpdate(
                { slug },
                { $set: problemData },
                { upsert: true, new: true }
            )

            console.log(`Saved: ${slug} (${mapDifficulty(meta.difficulty)})`)

            // rate limit — 1 second between requests
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        console.log(`\nDone! ${problemCount} problems seeded.`)
        process.exit(0)
    } catch (error) {
        console.error("Error:", error.message)
        process.exit(1)
    }
}

scrapeExercismData()