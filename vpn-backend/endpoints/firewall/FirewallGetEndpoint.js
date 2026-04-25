import {execSync} from "child_process";


getFirewallRules();

async function getFirewallRules() {
    const ufwRules = execSync("ufw status numbered").toString()

    console.log(ufwRules);

    const rules = ufwRules.split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 3)
        .slice(3)
        .map((line, index) => ({
            id: index + 1,
            name: line.split('] ').pop()
        }));

    console.log(rules)
}