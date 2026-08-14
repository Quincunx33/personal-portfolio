import fs from "node:fs";

const root = "/home/ubuntu/quincunx-portfolio";
const inventory = JSON.parse(fs.readFileSync(`${root}/github-public-repos.json`, "utf8"));
const typeMap = {
  Quincunx33: "Identity",
  "stress-test-server": "Security tooling",
  "stressTest-landing": "Security tooling",
  "Ip-tv": "Media workflow",
  "Stress-Tester": "Security tooling",
  "Virtual-machine": "Browser experiment",
  "Bolt-share": "File workflow",
  "bomber-v2": "API laboratory",
  reVCDOS: "Browser experiment",
  "ammo.js": "Systems library",
  EthicalHackingTools: "Security tooling",
  PyBrowser: "Browser experiment",
  "naruto-sasuke": "Interactive experience",
  "BananaOs-": "Systems experiment",
  WebOs: "Systems experiment",
  bananaos: "Systems experiment",
  "three.js": "Systems library",
  fastroads: "Interactive experience",
  re3: "Systems library",
};
const titleMap = {
  Quincunx33: "Quincunx33",
  "stress-test-server": "Stress Test Server",
  "stressTest-landing": "Stress Test Landing",
  "Ip-tv": "IP TV",
  "Stress-Tester": "Stress Tester",
  "Virtual-machine": "Virtual Machine",
  "Bolt-share": "Bolt Share",
  "bomber-v2": "Bomber v2",
  reVCDOS: "reVCDOS",
  "ammo.js": "Ammo.js",
  EthicalHackingTools: "Ethical Hacking Tools",
  PyBrowser: "PyBrowser",
  "naruto-sasuke": "Naruto / Sasuke",
  "BananaOs-": "BananaOS",
  WebOs: "WebOS",
  bananaos: "BananaOS / OS",
  "three.js": "Three.js",
  fastroads: "Fast Roads",
  re3: "re3",
};
const images = [
  "/manus-storage/taaissu-project-atlas_f8bb48a7.jpg",
  "/manus-storage/taaissu-signal_1b486891.jpg",
  "/manus-storage/taaissu-hero-texture_1b1f7428.jpg",
  "/manus-storage/taaissu-portrait_b84fff78.png",
];
const quote = (value) => JSON.stringify(value ?? "");
const entries = inventory.map((repo, index) => {
  const description = repo.description?.trim() || "Public repository on GitHub; description not provided.";
  return `  { name: ${quote(repo.name)}, displayName: ${quote(titleMap[repo.name] || repo.name)}, type: ${quote(typeMap[repo.name] || "Experiment")}, language: ${quote(repo.language)}, description: ${quote(description)}, stat: ${quote(repo.isFork ? "public fork / reference" : "public repository")}, url: ${quote(repo.url)}, image: ${quote(images[index % images.length])}, isFork: ${repo.isFork} },`;
}).join("\n");
const filters = [...new Set(["All work", ...inventory.map((repo) => typeMap[repo.name] || "Experiment")])];
const homePath = `${root}/client/src/pages/Home.tsx`;
let home = fs.readFileSync(homePath, "utf8");
home = home.replace(/const projects = \[[\s\S]*?\n\];\n\nconst filters = \[[\s\S]*?\];/, `const projects = [\n${entries}\n];\n\nconst filters = ${JSON.stringify(filters)};`);
home = home.replaceAll("project.name</h3>", "project.displayName</h3>");
home = home.replaceAll("project.description}", "project.description}");
home = home.replace("<span>{project.type}</span><span className=\"language\">{project.language}</span>", "<span>{project.type}</span><span className=\"language\">{project.language}</span>{project.isFork && <span className=\"fork-tag\">fork</span>}");
home = home.replace("<span>06</span><span>featured experiments</span>", `<span>${inventory.length}</span><span>public repos indexed</span>`);
home = home.replace("<span>00—06</span>", `<span>00—${String(inventory.length).padStart(2, "0")}</span>`);
fs.writeFileSync(homePath, home);
fs.copyFileSync(`${root}/github-public-repos.json`, `${root}/client/src/lib/githubRepos.json`);
