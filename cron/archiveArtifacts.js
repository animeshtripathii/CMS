import cron from "node-cron";
import Artifact from "../models/artifact.js";

export const archiveOldDraftsCron = () => {
  console.log("Archive old drafts cron job initialized");
  
  // Scheduled task set to execute daily at 00:00 hours
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running archive old drafts cron job...");
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const result = await Artifact.updateMany(
        { 
          status: "DRAFT",
          createdAt: { $lte: thirtyDaysAgo }
        },
        { 
          $set: { status: "ARCHIVED" } 
        }
      );
      
      console.log(`Archived ${result.modifiedCount} old draft artifacts.`);
    } catch (error) {
      console.error("Error running archive old drafts cron job:", error);
    }
  });
};
