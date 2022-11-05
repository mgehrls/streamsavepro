import { router, protectedProcedure } from "../trpc";
import { z } from "zod";


export const listItemRouter = router({
  getUserListItems: protectedProcedure
    .query(async ({ctx}) => {
      try {
        return await ctx.prisma.listItem.findMany({where:{
          userID: ctx.session.user.id
        },include:{
          media:true
        }})
      } catch (error) {
        console.log(error)
      }
     
    }),
  removeListItem: protectedProcedure
    .input(z.string())
    .mutation(async (req)=>{
      await req.ctx.prisma.listItem.delete({
        where:{
          id: req.input
        }
        
      })
    }),
  updateListItem: protectedProcedure
    .input(z.object({
      id:z.string(), 
      data:z.object({
        lastSeen: z.string()
      })
    }))
    .mutation(async (req)=>{
      await req.ctx.prisma.listItem.update({
        where:{
          id: req.input.id
        },
        data:{
          lastSeen: req.input.data.lastSeen 
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
