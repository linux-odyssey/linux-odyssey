import { User, UserProfile } from '@linux-odyssey/models'
import { hashPassword } from '../utils/auth.js'

export async function createUser(username, email, { password, socialLogin }) {
  const user = new User({
    username,
    email,
  })
  if (password) {
    user.hashedPassword = await hashPassword(password)
  } else if (socialLogin) {
    user.socialLogins.set(socialLogin.provider, socialLogin)
  } else {
    throw new Error('No password or social login provided')
  }
  await user.save()

  const userProfile = new UserProfile({
    user,
  })
  await userProfile.save()

  return user
}

export function leaderboard() {
  return UserProfile.aggregate([
    {
      $project: {
        user: true, // Include the user field in the projection
        completedQuests: {
          $map: {
            input: {
              $filter: {
                input: { $objectToArray: '$progress' }, // Convert the progress map to an array
                as: 'prog',
                cond: { $eq: ['$$prog.v.completed', true] }, // Filter for completed quests
              },
            },
            as: 'completedProg',
            in: '$$completedProg.k', // Extract the quest IDs
          },
        },
      },
    },
    {
      $addFields: {
        score: { $size: '$completedQuests' }, // Calculate the size of the completedQuests array
      },
    },
    {
      $match: {
        score: { $gt: 0 }, // Filter out users who haven't completed any quests
      },
    },
    { $sort: { score: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
  ])
}
