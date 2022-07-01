import dbClient from '../utils';
export default defineEventHandler(async (event) => {
    console.log("create post");
    const body = await useBody(event);
    const resp = await dbClient.imagePost.create({
        data: {
            title: body.title,
            content: body.content,
            image: body.image,
        }
    });
    return { resp }
})