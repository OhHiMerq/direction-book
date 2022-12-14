import type {
  QueryResolvers,
  MutationResolvers,
  DirectionPostRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

import { createFeedback } from '../feedbacks/feedbacks'
import { deleteInfromationImage } from '../informations/informations'

export const directionPosts: QueryResolvers['directionPosts'] = async ({
  input,
}) => {
  const { from, to, id } = input
  return (
    await db.directionPost.findMany({
      where: {
        userId: id == '' ? undefined : +id,
        locationA:
          from == '' ? undefined : { contains: from, mode: 'insensitive' },
        locationB: to == '' ? undefined : { contains: to, mode: 'insensitive' },
      },
    })
  ).sort((dA, dB) => Number(dB.createdAt) - Number(dA.createdAt))
}

export const directionPostsProfile: QueryResolvers['directionPostsProfile'] =
  async ({ id }) => {
    return (
      await db.directionPost.findMany({
        where: {
          userId: id,
        },
      })
    ).sort((dA, dB) => Number(dB.createdAt) - Number(dA.createdAt))
  }

export const directionPost: QueryResolvers['directionPost'] = ({ id }) => {
  return db.directionPost.findUnique({
    where: { id },
  })
}

export const createDirectionPost: MutationResolvers['createDirectionPost'] =
  async ({ input }) => {
    const f = await createFeedback({ input: { rating: 0 } })
    return db.directionPost.create({
      data: {
        userId: input.userId,
        totalFare: input.totalFare,
        locationA: input.locationA,
        locationB: input.locationB,
        description: input.description,
        feedbackId: f.id,
      },
    })
  }

export const updateDirectionPost: MutationResolvers['updateDirectionPost'] = ({
  id,
  input,
}) => {
  return db.directionPost.update({
    data: input,
    where: { id },
  })
}

export const deleteDirectionPost: MutationResolvers['deleteDirectionPost'] =
  async ({ id }) => {
    const dirPost = await db.directionPost.findUnique({
      where: { id },
      include: { informations: true },
    })

    await Promise.all(
      dirPost.informations.map((e) => {
        deleteInfromationImage({ publicId: e.imageUrl.split('&')[1] })
      })
    )

    await db.information.deleteMany({ where: { directionPostId: id } })
    await db.directionPost.delete({
      where: { id },
      include: { informations: true },
    })

    await db.feedback.delete({ where: { id: dirPost.feedbackId } })

    return dirPost
  }

export const DirectionPost: DirectionPostRelationResolvers = {
  user: (_obj, { root }) => {
    return db.directionPost.findUnique({ where: { id: root?.id } }).user()
  },
  informations: (_obj, { root }) => {
    return db.directionPost
      .findUnique({ where: { id: root?.id } })
      .informations()
  },
  feedback: (_obj, { root }) => {
    return db.directionPost.findUnique({ where: { id: root?.id } }).feedback()
  },
}
