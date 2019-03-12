import * as fs from "fs"
import * as path from "path"

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")).toString())
pkg.scripts = {
    start: "node index.js"
}
fs.writeFileSync(path.join(__dirname, "../build/package.json"), JSON.stringify(pkg, undefined, 4))