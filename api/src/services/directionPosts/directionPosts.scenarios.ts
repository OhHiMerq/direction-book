import type { Prisma, DirectionPost } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DirectionPostCreateArgs>({
  directionPost: {
    one: {
      data: {
        user: {
          create: {
            email: 'String6220360',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
        feedback: { create: {} },
      },
    },
    two: {
      data: {
        user: {
          create: {
            email: 'String9142965',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
        feedback: { create: {} },
      },
    },
  },
})

export type StandardScenario = ScenarioData<DirectionPost, 'directionPost'>
