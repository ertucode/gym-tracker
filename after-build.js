const fs = require("fs");

const copy = (src, dest) => {
	fs.cpSync(src, dest, {
		recursive: true,
		errorOnExist: true,
	});
};

copy("./public", "./.next/standalone/public");
copy("./.next/static", "./.next/standalone/.next/static");
copy("./dev.db", "./.next/standalone/dev.db");
// copy("./web.config", "./.next/standalone/web.config");
