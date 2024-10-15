const express = require('express');
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3001;

app.get('/backups', (req, res) => {
    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const database = process.env.MYSQL_DATABASE;
    const backupPath = process.env.BACKUP_PATH;
    const fileName = `${database}-backup-${Date.now()}.sql`;
    const filePath = path.join(backupPath, fileName);
    const command = `mysqldump -u ${user} -p${password} ${database} > ${filePath}`;

    console.log('Executing command:', command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error al generar el respaldo');
        }
        console.log('Backup created successfully');
        console.log(`stdout: ${stdout}`);

        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error(`Error al descargar el respaldo: ${err.message}`);
                return res.status(500).send('Error al descargar el respaldo');
            }
            console.log('Backup downloaded successfully');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
