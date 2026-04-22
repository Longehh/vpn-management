import {app, authenticateToken} from "../../backend.js";
import fs from "fs";

app.post('/copy', async (req, res) => {
    const {copyFile, copyFileInstance, copyInstance} = req.body;

    if(!copyFile.endsWith(".zip") && !copyFile.endsWith(".tar.gz")) {
        return res.send("File to copy must be in archive format.")
    }

    const copyLocation = `/var/lib/pterodactyl/volumes/${copyInstance}`;
    const copyFromLocation = `/var/lib/pterodactyl/volumes/${copyFileInstance}/${copyFile}`

    console.log(copyLocation);
    console.log(copyFromLocation);

    if(!fs.existsSync(copyLocation)) {
        return res.send(404);
    }

    if(!fs.existsSync(copyFromLocation)) {
        return res.send(404);
    }

    const finalLoc = copyLocation + `/${copyFile}`
     fs.copyFile(copyFromLocation, finalLoc, err => {
        if(err) {
            return res.send(err);
        }
        res.send("OK")
    });
});