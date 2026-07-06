const fs = require("fs");

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1SRzSdP67NP8P3r_jGrmQbn894aoNpbDRAuI0ZGwrMKE/gviz/tq?tqx=out:csv&gid=13264970";

async function run(){

    const csv = await fetch(SHEET_URL).then(r=>r.text());

    // 正確解析 Google CSV（支援雙引號、逗號）
    const rows = [];
    let row = [];
    let value = "";
    let quote = false;

    for(let i=0;i<csv.length;i++){

        const c = csv[i];

        if(c === '"'){
            if(quote && csv[i+1] === '"'){
                value += '"';
                i++;
            }else{
                quote = !quote;
            }
        }
        else if(c === "," && !quote){
            row.push(value);
            value="";
        }
        else if((c === "\n" || c === "\r") && !quote){

            if(value!=="" || row.length){
                row.push(value);
                rows.push(row);
                row=[];
                value="";
            }

            if(c === "\r" && csv[i+1]==="\n") i++;
        }
        else{
            value += c;
        }
    }

    if(value!=="" || row.length){
        row.push(value);
        rows.push(row);
    }

    let xml=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
<loc>https://chiachan-car.vercel.app/</loc>
<priority>1.0</priority>
</url>
`;

    // 第0列是標題，從第1列開始
    rows.slice(1).forEach(r=>{

        const id=(r[12]||"").trim();

        if(!id) return;

        xml += `
<url>
<loc>https://chiachan-car.vercel.app/?id=${id}</loc>
</url>`;
    });

    xml += `
</urlset>`;

    fs.writeFileSync("sitemap.xml",xml);

    console.log("Sitemap Updated");
}

run();
