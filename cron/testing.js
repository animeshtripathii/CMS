import cron from "node-cron"
export const testingCron = () => {
    console.log("Testing cron job started");
    cron.schedule("0 0 */4 * * *", () => {
        console.log("Cron job is running every 4 hours");
    });
}