import { router, protectedProcedure } from "../trpc";
import { z } from "zod";


export const listItemRouter = router({
  getUserListItems: protectedProcedure
    .query(async (req) => {
         return await req.ctx.prisma.listItem.findMany({where:{
           userID: req.ctx.session.user.id
         },include:{
           media:true
         }, orderBy:{
           lastSeen:"asc"
         }})
    }),
  removeListItem: protectedProcedure
    .input(z.object({userID: z.string(), mediaID: z.number()}))
    .mutation(async (req)=>{
      await req.ctx.prisma.listItem.delete({
        where:{
          userID_mediaID: req.input
        }
        
      })
    }),
  updateListItem: protectedProcedure
    .input(z.object({
      userID:z.string(),
      mediaID: z.number(), 
      lastSeen: z.string()
    }))
    .mutation(async (req)=>{
      await req.ctx.prisma.listItem.update({
        where:{
          userID_mediaID: {userID: req.input.userID, mediaID: req.input.mediaID}
        },
        data:{
          lastSeen: req.input.lastSeen 
        }
      })
    }),
  newListItem: protectedProcedure
    .input(z.object({
        userID: z.string(), 
        media: z.object({
          id: z.number(), 
          title: z.string(), 
          description: z.string().nullish(), 
          type: z.string(), 
          backdropPath: z.string().nullish(), 
          posterPath: z.string().nullish(),
    })}))
    .mutation(async (req)=>{
        await req.ctx.prisma.listItem.create(
          {
            select:{
              media:true,
              user: true,
            },
            data:{
              user: {
                connectOrCreate:{
                  where:{
                    id:req.input.userID
                  },
                  create:{
                    id: req.ctx.session.user.id,
                    name: req.ctx.session.user.name,
                    email: req.ctx.session.user.email,
                    image: req.ctx.session.user.image,
                  }
                }
              },
              media: {
                connectOrCreate:{
                  where:{
                    id: req.input.media.id
                    },
                  create:{
                    id:req.input.media.id,
                    description:req.input.media.description,
                    title: req.input.media.title,
                    type:req.input.media.type,
                    backdropPath:req.input.media.backdropPath,
                    posterPath:req.input.media.posterPath,
                    },
                  }
                }
              }
        })
    })
});
