import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getUserShows: protectedProcedure
    .query(({ctx})=> {
      return ctx.prisma.listItem.findMany({where:{
        userID: {
          equals:ctx.session.user.id
        },
        media:{
          type: "tv"
        }
      },include:{
        media:true
      }})
    }),
    getUserMovies: protectedProcedure
    .query(({ctx})=> {
      return ctx.prisma.listItem.findMany({where:{
        userID: {
          equals:ctx.session.user.id
        },
        media:{
          type: "movie"
        }
      },include:{
        media:true
      }})
    }),
  getUser: protectedProcedure
    .query(({ctx}) =>{
        return ctx.prisma.user.findUnique({where:{
          id: ctx.session.user.id
        }})
    }),
  getAll: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany();
    }),
});
