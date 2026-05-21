const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = walkSync(dir + '/' + file, filelist);
        }
        else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                filelist.push(dir + '/' + file);
            }
        }
    });
    return filelist;
};

const files = walkSync('admin/src/app');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('alert(')) {
        let lines = content.split('\n');
        let hasToastImport = content.includes("import toast from 'react-hot-toast'");
        
        let newLines = [];
        let modified = false;
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            // Add import if needed
            if (!hasToastImport && (line.includes("'use client'") || line.includes('"use client"'))) {
                newLines.push(line);
                newLines.push("import toast from 'react-hot-toast';");
                hasToastImport = true;
                continue;
            }
            
            if (line.includes('alert(')) {
                modified = true;
                if (line.includes('catch') || line.toLowerCase().includes('fail') || line.toLowerCase().includes('error') || line.includes('err.message') || line.includes('e.message') || line.includes('Please fill')) {
                    line = line.replace(/alert\(/g, 'toast.error(');
                } else if (line.includes('successfully') || line.includes('updated!') || line.includes('Coming Soon') || line.includes('Generating') || line.includes('Requesting')) {
                    line = line.replace(/alert\(/g, 'toast.success(');
                } else {
                    line = line.replace(/alert\(/g, 'toast.error(');
                }
            }
            newLines.push(line);
        }
        
        if (modified && !hasToastImport) {
            newLines.unshift("import toast from 'react-hot-toast';");
        }
        
        fs.writeFileSync(file, newLines.join('\n'));
        console.log('Modified', file);
    }
});
