const fs = require('fs');
const file = '/app/applet/frame28/src/routes/__root.tsx';
let content = fs.readFileSync(file, 'utf8');

const scriptToInject = `
        <script
          dangerouslySetInnerHTML={{
            __html: \`
              try {
                var stored = localStorage.getItem("fq_public_theme");
                var theme = stored === "light" || stored === "dark" ? stored : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                document.documentElement.setAttribute("data-theme", theme);
                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (e) {}
            \`,
          }}
        />`;

content = content.replace('<head>\n        <HeadContent />', '<head>\n        <HeadContent />' + scriptToInject);
fs.writeFileSync(file, content, 'utf8');
