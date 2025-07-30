const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");


const config = [
    { platform: "BlogApp",subrepo : "sub-repo" }
];

const versionType = process.argv[2] || "patch";
const summary = [];


config.forEach(({ platform, subrepo }) => {

    const repoPath = path.join(__dirname);
    console.log("repoPath", repoPath)
    const label = `${platform}/${subrepo}`;
    console.log(label)

    if (!fs.existsSync(repoPath)) {
        console.warn(`Skipping: ${label} - Directory not found.`);
        summary.push({ label, status: "Directory not found" });
        return;
    }


    try {
        console.log(`\n Processing ${label}...`);

        // Step 1: Get latest tag
        let latestTag = "";
        try {
            latestTag = execSync(`git describe --tags --abbrev=0`, { cwd: repoPath }).toString().trim();
        } catch {
            console.log("No tags found. Proceeding as first tag.");
        }

        // Step 2: Check for new commits since last tag
        let newCommits = true;
        if (latestTag) {
            const logOutput = execSync(`git log ${latestTag}..HEAD --oneline`, { cwd: repoPath }).toString().trim();
            newCommits = logOutput.length > 0;
        }

        if (!newCommits) {
            console.log("No new commits. Skipping tagging.");
            summary.push({ label, status: "Skipped (no new commits)" });
            return;
        }

        // Step 5: Run standard-version
        console.log(`Tagging ${label} as ${versionType}...`);
        execSync(`npx standard-version --release-as ${versionType} --skip.commit`, {
            cwd: repoPath,
            stdio: "inherit",
        });

        // Step 6: Get and push the new tag
        const newTag = execSync(`git describe --tags --abbrev=0`, { cwd: repoPath }).toString().trim();
        execSync(`git push origin ${newTag}`, { cwd: repoPath, stdio: "inherit" });

        console.log(`Tagged and pushed: ${newTag}`);
        summary.push({ label, status: `Tagged as ${newTag}` });
    } catch (err) {
        console.error(`Error in ${label}:`, err.message);
        summary.push({ label, status: `Error: ${err.message}` });
    }
});

console.log("\n Summary:");
summary.forEach(({ label, status }) => {
    console.log(`- ${label}: ${status}`);
});








