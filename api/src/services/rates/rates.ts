import type {
  QueryResolvers,
  MutationResolvers,
  RateRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const rates: QueryResolvers['rates'] = () => {
  return db.rate.findMany()
}

export const rate: QueryResolvers['rate'] = ({ id }) => {
  return db.rate.findUnique({
    where: { id },
  })
}

export const userRate: QueryResolvers['rate'] = ({ userId, feedbackId }) => {
  return db.rate.findFirst({
    where: { userId, feedbackId },
  })
}

export const createRate: MutationResolvers['createRate'] = ({ input }) => {
  return db.rate.create({
    data: input,
  })
}

export const updateRate: MutationResolvers['updateRate'] = ({ id, input }) => {
  return db.rate.update({
    data: input,
    where: { id },
  })
}

export const deleteRate: MutationResolvers['deleteRate'] = ({ id }) => {
  return db.rate.delete({
    where: { id },
  })
}

export const Rate: RateRelationResolvers = {
  user: (_obj, { root }) => {
    return db.rate.findUnique({ where: { id: root?.id } }).user()
  },
  feedback: (_obj, { root }) => {
    return db.rate.findUnique({ where: { id: root?.id } }).feedback()
  },
}
