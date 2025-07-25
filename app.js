const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// const args = process.argv.slice(2);
// const [repoUrl, branchName, tagPrefix = "v"] = args;

// if (!repoUrl || !branchName) {
//   console.error("Usage: node tag-repo.js <repo-url> <branch> [tagPrefix]");
//   process.exit(1);
// }

// // Create temp folder
// const tempDir = path.join(__dirname, "temp_repo");
// if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true });
// fs.mkdirSync(tempDir);

// try {
//   console.log("Cloning repository...");
//   execSync(`git clone ${repoUrl} .`, { cwd: tempDir, stdio: "inherit" });

//   console.log(`Checking out branch: ${branchName}`);
//   execSync(`git checkout ${branchName}`, { cwd: tempDir, stdio: "inherit" });

//   console.log(`Getting latest tag...`);
//   const latestTag = execSync(`git describe --tags --abbrev=0`, { cwd: tempDir }).toString().trim();
//   const nextTag = bumpTag(latestTag, tagPrefix);

//   console.log(`Creating tag: ${nextTag}`);
//   execSync(`git tag ${nextTag}`, { cwd: tempDir, stdio: "inherit" });

//   console.log(`Pushing tag: ${nextTag}`);
//   execSync(`git push origin ${nextTag}`, { cwd: tempDir, stdio: "inherit" });

//   console.log(`Tag created and pushed: ${nextTag}`);
// } catch (err) {
//   console.error("Error:", err.message);
// }

// function bumpTag(currentTag, prefix) {
//   const match = currentTag.match(/(\d+)\.(\d+)\.(\d+)$/);
//   if (!match) return `${prefix}1.0.0`;

//   const [_, major, minor, patch] = match;
//   const newTag = `${prefix}${major}.${minor}.${parseInt(patch) + 1}`;
//   return newTag;
// }

const config = [
  { platform: "BlogApp", subrepo: "sub-repo" }
];

const versionType = process.argv[2] || "patch";
const summary = [];


config.forEach(({ platform, subrepo }) => {
    console.log()
  const repoPath = path.join(__dirname);
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

