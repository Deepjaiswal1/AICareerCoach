// // app/actions/getJobs.js
// "use server"

// export async function fetchLiveJobs(jobTitle, location = "us") {
//   const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(jobTitle)}+in+${location}&num_pages=1`;
  
//   const options = {
//     method: 'GET',
//     headers: {
//       'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Get yours from rapidapi.com
//       'x-rapidapi-host': 'jsearch.p.rapidapi.com'
//     }
//   };

//   try {
//     const response = await fetch(url, options);
//     const result = await response.json();
//     return result.data; // Array of job objects
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

"use server"

/**
 * Fetches live job/internship data using the JSearch API via RapidAPI.
 * Get your free API key at: https://rapidapi.com/letscrape-6bR4n96bt/api/jsearch
 */


"use server"
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});

export async function fetchLiveJobs(jobTitle, location = "Mumbai") {
    if (!process.env.APIFY_TOKEN) {
        console.error("APIFY_TOKEN is missing.");
        return [];
    }

    try {
        // Construct a public LinkedIn search URL
        // f_WT=2 is the filter for 'Remote'
        const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}&f_TPR=r604800`; // f_TPR=r604800 is past week

        const run = await client.actor("curious_coder/linkedin-jobs-scraper").call({
            "urls": [searchUrl],
            "count": 5
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        return items.map(job => ({
            job_title: job.title || "Job Opportunity",
            employer_name: job.companyName || "Check LinkedIn",
            job_apply_link: job.link || job.jobUrl || "#", // Field name varies by actor
            job_city: job.location || location,
            job_is_remote: job.location?.toLowerCase().includes('remote') || false,
            posted_at: job.postedAt || "Recently"
        }));

    } catch (error) {
        console.error("Apify Actor Error:", error.message);
        return [];
    }
}