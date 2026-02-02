const readline = require('readline');
class FileExplorer {
    constructor() {
        this.root = { name: "", type: "dir", children: {}, parent: null };
        this.current = this.root;
    }
    getCwd() {
        let path = "";
        let temp = this.current;
        while (temp.parent !== null) {
            path = "/" + temp.name + path;
            temp = temp.parent;
        }
        return path === "" ? "/" : path;
    }
    execute(input) {
        const parts = input.trim().split(/\s+/);
        const command = parts[0];
        const arg = parts.slice(1).join(' ');

        switch (command) {
            case 'cwd':
                console.log(this.getCwd());
                break;
            case 'ls':
                const names = Object.keys(this.current.children).sort();
                console.log(names.length > 0 ? names.join(' ') : "(none)");
                break;
            case 'mkdir':
                if (this.current.children[arg]) {
                    console.log(`${arg} already exists`);
                } else {
                    this.current.children[arg] = { name: arg, type: "dir", children: {}, parent: this.current };
                }
                break;
            case 'touch':
                if (this.current.children[arg]) {
                    console.log(`${arg} already exists`);
                } else {
                    this.current.children[arg] = { name: arg, type: "file", parent: this.current };
                }
                break;
            case 'cd':
                this.handleCd(arg);
                break;
            case 'exit':
                process.exit();
                break;
        }
    }
    handleCd(path) {
        if (!path || path === "") return;
        if (path === "/") {
            this.current = this.root;
            return;
        }

        const parts = path.split('/').filter(p => p !== "");
        let temp = path.startsWith('/') ? this.root : this.current;

        for (const part of parts) {
            if (part === "..") {
                if (temp.parent) {
                    temp = temp.parent;
                } else {
                    console.log("currently at root");
                    return;
                }
            } else {
                const next = temp.children[part];
                if (!next) {
                    console.log(`${part} not found.`);
                    return;
                }
                if (next.type !== "dir") {
                    console.log(`${part} is not a directory.`);
                    return;
                }
                temp = next;
            }
        }
        this.current = temp;
    }
}

const explorer = new FileExplorer();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = () => {
    rl.question('', (input) => {
        if (input.trim()) explorer.execute(input);
        ask();
    });
};
ask();