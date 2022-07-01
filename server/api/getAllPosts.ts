import dbClient from '../utils';
export default defineEventHandler(async (event) => {
    console.log("get all posts");
    const data = await dbClient.imagePost.findMany();
    return  data 
  })