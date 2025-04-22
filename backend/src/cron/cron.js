import cron from 'cron'
import https from 'https'
import dotenv from 'dotenv'

dotenv.config();

const job = new cron.CronJob("*/14 * * * *", function(){
    https.get(process.env.NEXT_PUBLIC_BACKEND_URL, (res) => {
        if(res.statusCode === 200) console.log("GET Request sent successfully");
        else console.log("GET request failed", res.statusCode)
    })
    .on("error", (e) => console.error("Error while sending request", e))
});

export default job;