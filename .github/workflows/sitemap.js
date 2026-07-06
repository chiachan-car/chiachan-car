const fs = require("fs");

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1SRzSdP67NP8P3r_jGrmQbn894aoNpbDRAuI0ZGwrMKE/gviz/tq?tqx=out:csv&gid=13264970";

async function run(){

    const csv = await fetch(SHEET_URL).then(r=>r.text());

    const rows = csv
        .split("\n")
        .slice(1)
        .map(r=>r.split(","));

    let xml=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
<loc>https://chiachan-car.vercel.app/</loc>
<priority>1.0</priority>
</url>
`;

    rows.forEach(r=>{

        const id=(r[12]||"").replace(/"/g,"").trim();

        if(!id) return;

        xml+=`
<url>
<loc>https://chiachan-car.vercel.app/?id=${id}</loc>
</url>`;

    });

    xml+=`
</urlset>`;

    fs.writeFileSync("sitemap.xml",xml);

    console.log("Sitemap Updated");

}

run();
