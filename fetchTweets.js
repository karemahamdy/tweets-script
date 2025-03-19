
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const client = new TwitterApi(process.env.BEARER_TOKEN);


async function getUserId(username) {
  try {
    const user = await client.v2.userByUsername(username);
    return user?.data?.id || null;
  } catch (error) {
    return null;
  }
}

async function fetchTweets(username) {
  const userId = await getUserId(username);
  if (!userId) {
    return;
  }

  try {
    const tweets = await client.v2.userTimeline(userId, {
      max_results: 100,
      start_time: "2022-01-01T00:00:00Z",  
      end_time: "2022-12-31T23:59:59Z"     
    });

    if (!tweets.data || tweets.data.length === 0) {
      console.log("there is no tweets in this year");
      return;
    }

    console.log("all tweets saved in tweets.json");
    fs.writeFileSync("tweets.json", JSON.stringify(tweets.data, null, 2), "utf-8");
    console.log("check tweets.json to show all tweets");
  } catch (error) {
    console.error("err", error);
  }
}

fetchTweets("user name");

